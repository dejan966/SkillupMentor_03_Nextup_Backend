import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'schemas/user.schema';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UtilsService } from 'modules/utils/utils.service';
import { CookieType, JwtType, TokenPayload } from 'interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    console.info('Validating user...');
    const user = await this.usersService.findBy({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await this.utilsService.compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    console.info('User is valid');
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword: string = await this.utilsService.hash(
      registerUserDto.password,
    );
    const user = await this.usersService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    try {
      await this.usersService.update(userId, { refresh_token: rt });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while updating user refresh token',
      );
    }
  }

  async generateToken(user: User, type: JwtType) {
    const payload: TokenPayload = { sub: user._id, name: user.email, type };
    let token: string;
    try {
      switch (type) {
        case JwtType.ACCESS_TOKEN:
          token = await this.jwtService.signAsync(payload);
          break;
        case JwtType.REFRESH_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
          });
          break;
        case JwtType.PASSWORD_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '15m',
          });
          break;
        default:
          throw new BadRequestException('Access denied');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while generating a new token.',
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
            'JWT_SECRET_EXPIRES',
          )}; SameSite:strict`;
          break;
        case CookieType.REFRESH_TOKEN:
          cookie = `refresh_token=${token}; HttpOnly; Path =/; Max-Age=${this.configService.get(
            'JWT_REFRESH_SECRET_EXPIRES',
          )}; SameSite:strict`;
          break;
        default:
          throw new BadRequestException('Access denied');
      }
      return cookie;
    } catch (error) {
      console.error(error);
      /* if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists.');
      }
      throw new InternalServerErrorException(
        'Something went wrong while generating a new cookie.',
      ); */
    }
  }

  async refreshTokens(req: Request): Promise<User> {
    const user = await this.usersService.findBy({
      refresh_token: req.cookies.refresh_token,
    });
    if (!user) {
      throw new ForbiddenException();
    }
    try {
      await this.jwtService.verifyAsync(user.refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(
        'Something went wrong while refreshing tokens',
      );
    }
    const token = await this.generateToken(user, JwtType.ACCESS_TOKEN);
    const cookie = await this.generateCookie(token, CookieType.ACCESS_TOKEN);

    try {
      req.res.setHeader('Set-Cookie', cookie);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while setting cookies into the response header',
      );
    }
    return user;
  }

  async signout(userId: string, res: Response): Promise<void> {
    const user = await this.usersService.findById(userId);
    await this.usersService.update(user._id, { refresh_token: null });
    try {
      res.setHeader('Set-Cookie', this.getCookiesForSignOut()).sendStatus(200);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while setting cookies into response header',
      );
    }
  }

  getCookiesForSignOut(): string[] {
    return [
      'access_token=; HttpOnly; Path =/; Max-Age=0;',
      'refresh_token=; HttpOnly; Path =/; Max-Age=0',
    ];
  }

  async getUserIfTokenMatches(refreshToken: string, userId: string) {
    const user = await this.usersService.findById(userId);
    const isRefreshTokenMatching = await this.utilsService.compareHash(
      refreshToken,
      user.refresh_token,
    );
    if (isRefreshTokenMatching) {
      return {
        id: user._id,
        email: user.email,
      };
    }
  }
}
