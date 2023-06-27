import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World';
  }
  
  getNegan(): string {
    return 'Hello Negan';
  }
}
