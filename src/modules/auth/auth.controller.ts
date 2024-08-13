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
} from '@nestjs/common';
import { Public } from 'decorators/public.decorator';
import { Response } from 'express';
import { User } from 'schemas/user.schema';
import {
  CookieType,
  JwtType,
  RequestWithUser,
} from 'interfaces/auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { auth, firestore } from 'firebase-admin';
import Logging from 'library/Logging';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('firebaseLogin')
  @HttpCode(HttpStatus.OK)
  async firebaseLogin(@Body() body, @Res({ passthrough: true }) res: Response) {
    const user_uid = body.uid;
    const display_name = body.displayName;
    const photo_url = body.photoURL;
    const email = body.email;
    const access_token = body.stsTokenManager.accessToken;
    const refresh_token = body.stsTokenManager.refreshToken;

    const userDB = firestore().collection('users');
    const checkUser = auth().getUser(user_uid);
    if (checkUser) {
      try {
        res.cookie('access_token', access_token).json(body);
        return;
      } catch (err) {
        Logging.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while setting cookies into response header',
        );
      }
    }

    const docData = {
      uid: user_uid,
      displayName: display_name,
      photoURL: photo_url,
      email: email,
      refreshToken: refresh_token,
    };
    userDB.add(docData);
    try {
      res.cookie('access_token', access_token).json(body);
    } catch (err) {
      Logging.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while setting cookies into response header',
      );
    }
  }

  @Post('firebaseSignout')
  @HttpCode(HttpStatus.OK)
  async firebaseSignout(@Res({ passthrough: true }) res: Response) {
    return this.authService.firebaseSignout(res);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const access_token = await this.authService.generateToken(
      user,
      JwtType.ACCESS_TOKEN,
    );
    const refresh_token = await this.authService.generateToken(
      user,
      JwtType.REFRESH_TOKEN,
    );

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
      res
        .setHeader('Set-Cookie', [access_token_cookie, refresh_token_cookie])
        .json(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while setting cookies into response header',
      );
    }
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetCurrentUser() userData: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(userData._id, res);
  }
}
