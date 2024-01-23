import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { AbstractService } from 'modules/common/abstract.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Event } from 'schemas/event.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtType } from 'interfaces/auth.interface';
import { UtilsService } from 'modules/utils/utils.service';
import { IJwtPayload } from 'interfaces/jwt-payload.interface';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService extends AbstractService<User> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly utilsService: UtilsService,
    private readonly mailerService: MailerService,
  ) {
    super(userModel);
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  
  async checkEmail(userEmail: string) {
    const user = await this.findBy({ email: userEmail });
    if (user) {
      return this.makeToken(user);
    }
  }
  
  async checkToken(user: User, hashed_token: string) {
    if (
      await this.utilsService.compareHash(user.password_token, hashed_token)
    ) {
      const decoded = this.jwtService.decode(user.password_token);
      const updatedJwtPayload: IJwtPayload = decoded as IJwtPayload;
      const expires = new Date(updatedJwtPayload.exp * 1000).toLocaleString();
      const curr = new Date().toLocaleString();
      if (user && curr < expires) {
        return true;
      }
    }
    return false;
  }

  async makeToken(user: User){
    const { password_token } = user;

    if (password_token) {
      const decoded = this.jwtService.decode(password_token);
      const updatedJwtPayload: IJwtPayload = decoded as IJwtPayload;
      const expires = new Date(updatedJwtPayload.exp * 1000).toLocaleString();
      const curr = new Date().toLocaleString();
      if (curr < expires) {
        throw new BadRequestException('User already requested the token.');
      }
    }

    const type = JwtType.PASSWORD_TOKEN;
    const token = await this.jwtService.signAsync(
      { sub: user._id, name: user.email, type },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '900s',
      },
    );

    const hashed = await this.utilsService.hash(token);

    await this.update(user._id, { password_token: token });

    const subject = 'Your password reset token';
    const text = `Hi.<p>Your password reset link is: </p><p>It expires in 15 minutes.</p><p>Your Nextup support team</p>`;
    const html = `Hi.<p>Your password reset link is <a href="http://localhost:3000/me/update-password?token=${hashed}">here</a>.</p><p>It expires in 15 minutes.</p><p>Your Nextup support team</p>`;
    
    return this.sendEmail({
      from: 'Nextup Support <ultimate24208@gmail.com>',
      to: user.email,
      subject: subject,
      text: text,
      html: html
    });
  }

  async sendEmail(options: ISendMailOptions) {
    const response = await this.mailerService.sendMail(options);
    return response;
  }

  async updatePassword(
    user: User,
    updateUserDto: {
      current_password: string;
      password: string;
      confirm_password: string;
    },
  ): Promise<User> {
    if (updateUserDto.password && updateUserDto.confirm_password) {
      if (
        !(await this.utilsService.compareHash(
          updateUserDto.current_password,
          user.password,
        ))
      )
        throw new BadRequestException('Incorrect current password.');
      if (updateUserDto.password !== updateUserDto.confirm_password)
        throw new BadRequestException('Passwords do not match.');
      if (
        await this.utilsService.compareHash(
          updateUserDto.password,
          user.password,
        )
      )
        throw new BadRequestException(
          'New password cannot be the same as old password.',
        );
      user.password = await this.utilsService.hash(updateUserDto.password);
    }
    user.password_token = null;
    return this.model.findOneAndUpdate({ _id: user._id }, user);
  }

  async findAllUsers() {
    return await this.userModel.find().populate('events');
  }

  async addedEvent(user: User, event: Event) {
    user.events.push(event._id);
    return await this.model.updateOne({ _id: user._id }, user);
  }
}
