import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { EventGuard } from 'modules/auth/guards/event.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { User } from 'schemas/user.schema';
import { Event } from 'schemas/event.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  saveEventImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'helpers/imageStorage';
import { join } from 'path';
import { ObjectId } from 'mongoose';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @GetCurrentUser() creator: User,
  ) {
    return this.eventsService.addEvent(createEventDto, creator);
  }

  @Get('search')
  async eventSearch(
    @Query('name') searchValue: string,
    @Query('date') dateValue: string,
    @Query('page') pageNumber: number,
  ) {
    return this.eventsService.eventSearch(searchValue, dateValue, pageNumber);
  }

  @Patch('bookUser/:id')
  @UseGuards(JwtAuthGuard)
  async addUser(@Param('id') _id: ObjectId, @GetCurrentUser() user: User) {
    return await this.eventsService.bookUser(_id, user);
  }

  @Get()
  async findAll() {
    return await this.eventsService.findAll('creator booked_users');
  }

  @Get('user/upcomingEvents')
  @UseGuards(JwtAuthGuard)
  async currUserUpcomingEvents(@GetCurrentUser() user: User) {
    const upcomingEvents = await this.eventsService.currUserUpcomingEvents(
      user,
    );
    return upcomingEvents;
  }

  @Get('user/recentEvents')
  @UseGuards(JwtAuthGuard)
  async currUserRecentEvents(@GetCurrentUser() user: User) {
    const upcomingEvents = await this.eventsService.currUserRecentEvents(user);
    return upcomingEvents;
  }

  @Get('upcomingEvents')
  async upcomingEvents() {
    const events = await this.eventsService.upcomingEvents();
    return events;
  }

  @Get('recentEvents')
  async recentEvents() {
    const events = await this.eventsService.recentEvents();
    return events;
  }

  @Post('upload/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', saveEventImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') _id: ObjectId,
  ): Promise<Event> {
    const filename = file?.filename;

    if (!filename)
      throw new BadRequestException('File must be a png, jpg/jpeg');

    const imagesFolderPath = join(process.cwd(), 'uploads/events');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.eventsService.updateEventImageId(_id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension!');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') _id: ObjectId) {
    return await this.eventsService.findById(_id, 'creator');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, EventGuard)
  async update(
    @Param('id') _id: ObjectId,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(_id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, EventGuard)
  async remove(@Param('id') _id: ObjectId) {
    return await this.eventsService.remove(_id);
  }
}
