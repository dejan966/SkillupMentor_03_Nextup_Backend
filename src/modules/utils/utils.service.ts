import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class UtilsService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}
  async hash(data: string, salt = 10) {
    try {
      const generatedSalt = await bcrypt.genSalt(salt);
      return bcrypt.hash(data, generatedSalt);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while hashing the password',
      );
    }
  }

  compareHash(data: string, encryptedData: string) {
    try {
      return bcrypt.compare(data, encryptedData);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while comparing the hash.',
      );
    }
  }

  async sendEmail(email: string, subject: string, text: string, html: string) {
    try {
      const response = await this.mailerService.sendMail({
        from: 'Nextup Support <ultimate24208@gmail.com>',
        to: email,
        subject: subject,
        text: text,
        html: html,
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while sending the email.',
      );
    }
  }
}
