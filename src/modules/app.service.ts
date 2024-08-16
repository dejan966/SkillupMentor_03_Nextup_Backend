import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloWorld() {
    return 'Hello World';
  }
}
