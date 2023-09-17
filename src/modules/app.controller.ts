import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ListUsersResult } from 'firebase-admin/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('usersF')
  async getAllUsersF():Promise<ListUsersResult>{
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
