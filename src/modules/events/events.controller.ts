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

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: CreateEventDto, @GetCurrentUser() user: User) {
    createEventDto.creator = user;
    return this.eventsService.create(createEventDto);
  }

  @Patch('addUser/:id')
  @UseGuards(JwtAuthGuard)
  async addUser(@Param('id') id: string, @GetCurrentUser() user: User){
    return this.eventsService.addUser(id, user);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserGuard)
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
