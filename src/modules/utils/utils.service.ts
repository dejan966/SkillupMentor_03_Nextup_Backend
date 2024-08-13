import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  constructor(private mailerService: MailerService) {}
  async hash(data: string, salt = 10) {
    try {
      const generatedSalt = await bcrypt.genSalt(salt);
      return bcrypt.hash(data, generatedSalt);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while hashing the password',
      );
    }
  }

  compareHash(data: string, encryptedData: string) {
    try {
      return bcrypt.compare(data, encryptedData);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while comparing the hash.',
      );
    }
  }

  async sendEmail(options: ISendMailOptions) {
    try {
      const response = await this.mailerService.sendMail(options);
      return response;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while sending the email.',
      );
    }
  }
}
