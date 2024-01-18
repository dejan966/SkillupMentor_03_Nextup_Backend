import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ListUsersResult } from 'firebase-admin/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('authUsers')
  async getAllUsersF():Promise<ListUsersResult>{
    return this.appService.authUsers();
  }

  @Get('usersDB')
  async getAllUsersFromDB(){
    return this.appService.getAllUsersFromDB();
  }
  
  @Get('/')
  getHelloWord(): string {
    return this.appService.getHelloWorld();
  }
}
