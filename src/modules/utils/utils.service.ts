import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import Logging from 'library/Logging';

export class UtilsService {
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
        'Something went wrong while comparing the hash',
      );
    }
  }
}
