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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';
import { EventGuard } from 'modules/auth/guards/event.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { User } from 'schemas/user.schema';
import MongooseClassSerializerInterceptor from 'interceptors/mongoose.interceptor';
import { Event } from 'schemas/event.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  saveEventImageToStorage,
  isFileExtensionSafe,
  removeFile,
} from 'helpers/imageStorage';
import { join } from 'path';

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

  @Patch('bookUser/:id')
  @UseGuards(JwtAuthGuard, EventGuard)
  async addUser(@Param('id') _id: string, @GetCurrentUser() user: User) {
    return this.eventsService.bookUser(_id, user);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll('creator');
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveEventImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') _id: string,
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
  async findOne(@Param('id') _id: string) {
    return this.eventsService.findById(_id, 'creator');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, EventGuard)
  async update(
    @Param('id') _id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(_id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, EventGuard)
  async remove(@Param('id') _id: string) {
    return this.eventsService.remove(_id);
  }
}
