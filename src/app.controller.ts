import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/hello')
  getHello(@Req() request: Request): string {
    console.log('User', JSON.stringify(request['user']));
    return 'Hello ' + JSON.stringify(request['user']);
  }

  @Get('usersF')
  async getAllUsers(){
    return this.appService.getAllUsers();
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
