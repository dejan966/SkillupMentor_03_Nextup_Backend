import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { UserGuard } from 'modules/auth/guards/user.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { User } from 'schemas/user.schema';
import { ObjectId } from 'mongoose';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: CreateEventDto, @GetCurrentUser() creator: User) {
    return this.eventsService.addEvent(createEventDto, creator);
  }

  @Patch('bookUser/:id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async addUser(@Param('id') _id: ObjectId, @GetCurrentUser() user: User){
    return this.eventsService.bookUser(_id, user);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') _id: ObjectId) {
    return this.eventsService.findById(_id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async update(@Param('id') _id: ObjectId, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(_id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async remove(@Param('id') _id: ObjectId) {
    return this.eventsService.remove(_id);
  }
}
