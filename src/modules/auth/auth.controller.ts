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
import { UtilsService } from 'modules/utils/utils.service';
import { UsersService } from 'modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('welcomeEmail')
  async welcomeEmail(@Body() body: { email: string }) {
    const subject = 'Welcome email';
    const text = `Hi.<p>Thank you for your registration! We will notify you about any new events in your area.</p><p>Your Nextup support team</p>`;
    const html = `Hi.<p>Thank you for your registration! We will notify you about any new events in your area.</p><p>Your Nextup support team</p>`;
    return this.usersService.sendEmail({
      from: 'Nextup Support <ultimate24208@gmail.com>',
      to: body.email,
      subject: subject,
      text: text,
      html: html,
    });
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
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
        .json({ ...user });
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
