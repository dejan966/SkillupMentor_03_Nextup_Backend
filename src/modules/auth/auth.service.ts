import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserDocument } from "schemas/user.schema";
import { Request, Response } from "express";
import { UsersService } from "../users/users.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UtilsService } from "modules/utils/utils.service";
import { CookieType, JwtType, TokenPayload } from "interfaces/auth.interface";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import Logging from "library/Logging";
import { RolesService } from "modules/roles/roles.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    Logging.info("Validating user...");
    const user = await this.usersService.findBy({ email });
    if (!user) {
      throw new BadRequestException("User with this email doesnt exist");
    }
    if (!(await this.utilsService.compareHash(password, user.password))) {
      throw new BadRequestException("Invalid password");
    }
    Logging.info("User is valid");
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    const user = await this.usersService.createUser({
      ...registerUserDto,
      role: (await this.rolesService.findBy({ name: "USER" }))._id,
    });
    return user;
  }

  async updateRtHash(userId: Types.ObjectId, rt: string): Promise<void> {
    try {
      const hashedRt = await this.utilsService.hash(rt);
      await this.usersService.update(userId, { refresh_token: hashedRt });
    } catch (error) {
      throw new InternalServerErrorException(
        "Something went wrong while updating user refresh token",
      );
    }
  }

  async generateToken(user: UserDocument, type: JwtType) {
    const payload: TokenPayload = { sub: user._id, name: user.email, type };
    let token: string;
    try {
      switch (type) {
        case JwtType.ACCESS_TOKEN:
          token = await this.jwtService.signAsync(payload);
          break;
        case JwtType.REFRESH_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get("JWT_REFRESH_SECRET"),
          });
          break;
        case JwtType.PASSWORD_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get("JWT_PASSWORD_SECRET"),
            expiresIn: "15m",
          });
          break;
        default:
          throw new BadRequestException("Access denied");
      }
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while generating a new token.",
      );
    }
    return token;
  }

  async generateCookie(token: string, type: CookieType): Promise<string> {
    try {
      let cookie: string;
      switch (type) {
        case CookieType.ACCESS_TOKEN:
          cookie = `access_token=${token}; HttpOnly; Path =/; Max-Age=${this.configService.get(
            "JWT_SECRET_EXPIRES",
          )}; SameSite:strict`;
          break;
        case CookieType.REFRESH_TOKEN:
          cookie = `refresh_token=${token}; HttpOnly; Path =/; Max-Age=${this.configService.get(
            "JWT_REFRESH_SECRET_EXPIRES",
          )}; SameSite:strict`;
          break;
        default:
          throw new BadRequestException("Access denied");
      }
      return cookie;
    } catch (error) {
      Logging.error(error);
    }
  }

  async refreshTokens(req: Request): Promise<UserDocument> {
    const decode = await this.jwtService.decode(req.cookies.refresh_token);
    const user = await this.usersService.findById(decode.sub);
    if (!user) {
      throw new ForbiddenException();
    }

    try {
      await this.jwtService.verifyAsync(req.cookies.refresh_token, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
    } catch (error) {
      Logging.error(error);
      throw new UnauthorizedException("Something went wrong while refreshing tokens");
    }

    const access_token = await this.generateToken(user, JwtType.ACCESS_TOKEN);
    const refresh_token = await this.generateToken(user, JwtType.REFRESH_TOKEN);

    const access_token_cookie = await this.generateCookie(
      access_token,
      CookieType.ACCESS_TOKEN,
    );
    const refresh_token_cookie = await this.generateCookie(
      refresh_token,
      CookieType.REFRESH_TOKEN,
    );

    try {
      await this.updateRtHash(user._id, refresh_token);
      req.res.setHeader("Set-Cookie", [access_token_cookie, refresh_token_cookie]);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while setting cookies into the response header",
      );
    }
    return user;
  }

  async firebaseSignout(userId: Types.ObjectId, res: Response): Promise<void> {
    const user = await this.usersService.findById(userId);
    await this.usersService.update(user._id, { refresh_token: null });
    try {
      res.setHeader("Set-Cookie", this.getCookiesForSignOut()).sendStatus(200);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while setting cookies into response header",
      );
    }
  }

  async signout(userId: Types.ObjectId, res: Response): Promise<void> {
    const user = await this.usersService.findById(userId);
    await this.usersService.update(user._id, { refresh_token: null });
    try {
      res.setHeader("Set-Cookie", this.getCookiesForSignOut()).sendStatus(200);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while setting cookies into response header",
      );
    }
  }

  getCookiesForSignOut(): string[] {
    return [
      "access_token=; HttpOnly; Path =/; Max-Age=0;",
      "refresh_token=; HttpOnly; Path =/; Max-Age=0",
    ];
  }

  async getUserIfTokenMatches(refreshToken: string, userId: Types.ObjectId) {
    const user = await this.usersService.findById(userId);
    const isRefreshTokenMatching = await this.utilsService.compareHash(
      refreshToken,
      user.refresh_token,
    );
    if (isRefreshTokenMatching) {
      return {
        _id: user._id,
        email: user.email,
      };
    }
  }
}
