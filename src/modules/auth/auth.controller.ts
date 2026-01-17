import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  InternalServerErrorException,
  UseInterceptors,
  Get,
} from "@nestjs/common";
import { Public } from "decorators/public.decorator";
import { Request, Response } from "express";
import { User, UserDocument } from "schemas/user.schema";
import { CookieType, JwtType, RequestWithUser } from "interfaces/auth.interface";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { GetCurrentUser } from "decorators/get-current-user.decorator";
import Logging from "library/Logging";
import { UsersService } from "modules/users/users.service";
import MongooseClassSerializerInterceptor from "interceptors/mongoose.interceptor";
import { HybridAuthGuard } from "./guards/hybrid.guard";
import { randomBytes } from "crypto";
import { RolesService } from "modules/roles/roles.service";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";
import * as admin from "firebase-admin";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post("firebaseLogin")
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @HttpCode(HttpStatus.OK)
  async firebaseLogin(
    @Body() body: { idToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const decoded = await admin.auth().verifyIdToken(body.idToken);
    const { uid, name, picture, email } = decoded;

    let user = await this.usersService.getFirebaseUserByUid(uid);
    if (!user) {
      const password = randomBytes(32).toString("hex");
      const newUser = {
        uid: uid,
        email: email,
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1],
        avatar: picture,
        password: password,
        confirm_password: password,
        type: "Google User",
        role_id: (await this.rolesService.findBy({ name: "USER" }))._id,
      };
      user = await this.usersService.createUser(newUser);
    }

    const access_token = await this.authService.generateToken(user, JwtType.ACCESS_TOKEN);
    const refresh_token = await this.authService.generateToken(user, JwtType.REFRESH_TOKEN);

    const access_token_cookie = await this.authService.generateCookie(
      access_token,
      CookieType.ACCESS_TOKEN,
    );
    const refresh_token_cookie = await this.authService.generateCookie(
      refresh_token,
      CookieType.REFRESH_TOKEN,
    );

    try {
      await this.authService.updateRtHash(user._id, refresh_token);
      res.setHeader("Set-Cookie", [access_token_cookie, refresh_token_cookie]);
      return user;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while setting cookies into response header",
      );
    }
  }

  @Post("firebaseSignout")
  @UseGuards(HybridAuthGuard)
  @HttpCode(HttpStatus.OK)
  async firebaseSignout(
    @GetCurrentUser() userData: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.firebaseSignout(userData._id, res);
  }

  @Public()
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const { user } = req;
    const access_token = await this.authService.generateToken(user, JwtType.ACCESS_TOKEN);
    const refresh_token = await this.authService.generateToken(user, JwtType.REFRESH_TOKEN);

    const access_token_cookie = await this.authService.generateCookie(
      access_token,
      CookieType.ACCESS_TOKEN,
    );
    const refresh_token_cookie = await this.authService.generateCookie(
      refresh_token,
      CookieType.REFRESH_TOKEN,
    );

    try {
      await this.authService.updateRtHash(user._id, refresh_token);
      res.setHeader("Set-Cookie", [access_token_cookie, refresh_token_cookie]); //.json(req.user);
      return req.user;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        "Something went wrong while setting cookies into response header",
      );
    }
  }

  @Post("signout")
  @UseGuards(HybridAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetCurrentUser() userData: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(userData._id, res);
  }

  @Get("admin")
  @UseGuards(HybridAuthGuard)
  async checkAdmin(@GetCurrentUser() user: UserDocument) {
    const role = await this.rolesService.findBy({ name: "ADMIN" });
    return user.role_id.equals(role._id);
  }

  @Post("refresh")
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @HttpCode(HttpStatus.ACCEPTED)
  async refreshTokens(@Req() req: Request): Promise<UserDocument> {
    return this.authService.refreshTokens(req);
  }
}
