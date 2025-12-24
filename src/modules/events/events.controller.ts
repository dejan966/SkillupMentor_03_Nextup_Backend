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
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { EventGuard } from "modules/auth/guards/event.guard";
import { GetCurrentUser } from "decorators/get-current-user.decorator";
import { UserDocument } from "schemas/user.schema";
import { EventDocument, Event } from "schemas/event.schema";
import { FileInterceptor } from "@nestjs/platform-express";
import { saveEventImageToStorage, isFileExtensionSafe, removeFile } from "helpers/imageStorage";
import { join } from "path";
import { Types } from "mongoose";
import MongooseClassSerializerInterceptor from "interceptors/mongoose.interceptor";
import { PaginatedResult } from "interfaces/paginated-result";
import { JwtAuthGuard } from "modules/auth/guards/jwt.guard";
import { HybridAuthGuard } from "modules/auth/guards/hybrid.guard";

@Controller("events")
@UseInterceptors(MongooseClassSerializerInterceptor(Event))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(HybridAuthGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @GetCurrentUser() creator: UserDocument,
  ) {
    return this.eventsService.addEvent(createEventDto, creator);
  }

  @Get("search")
  async eventSearch(
    @Query("name") searchValue: string,
    @Query("date") dateValue: string,
    @Query("page") pageNumber: number,
  ) {
    return this.eventsService.eventSearch(searchValue, dateValue, pageNumber);
  }

  @Patch("bookUser/:id")
  @UseGuards(HybridAuthGuard, EventGuard)
  async addUser(@Param("id") _id: Types.ObjectId, @GetCurrentUser() user: UserDocument) {
    return await this.eventsService.bookUser(_id, user);
  }

  @Get()
  async findAll(@Query("page") pageNumber: number): Promise<PaginatedResult<EventDocument>> {
    return await this.eventsService.findPaginate(pageNumber, "creator booked_users");
  }

  @Get("user/upcomingEvents")
  @UseGuards(HybridAuthGuard)
  async currUserUpcomingEvents(@GetCurrentUser() user: UserDocument) {
    const upcomingEvents = await this.eventsService.currUserUpcomingEvents(user);
    return upcomingEvents;
  }

  @Get("user/recentEvents")
  @UseGuards(HybridAuthGuard)
  async currUserRecentEvents(@GetCurrentUser() user: UserDocument) {
    const upcomingEvents = await this.eventsService.currUserRecentEvents(user);
    return upcomingEvents;
  }

  @Get("upcomingEvents")
  async upcomingEvents() {
    const events = await this.eventsService.upcomingEvents();
    return events;
  }

  @Get("recentEvents")
  async recentEvents() {
    const events = await this.eventsService.recentEvents();
    return events;
  }

  @Post("upload/:id")
  @UseGuards(HybridAuthGuard)
  @UseInterceptors(FileInterceptor("image", saveEventImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") _id: Types.ObjectId,
  ): Promise<EventDocument> {
    const filename = file?.filename;

    if (!filename) throw new BadRequestException("File must be a png, jpg/jpeg");

    const imagesFolderPath = join(process.cwd(), "uploads/events");
    const fullImagePath = join(imagesFolderPath + "/" + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.eventsService.updateEventImageId(_id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException("File content does not match extension!");
  }

  @Get(":id")
  async findOne(@Param("id") _id: Types.ObjectId): Promise<EventDocument> {
    return await this.eventsService.findById(_id, "creator");
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, EventGuard)
  async update(@Param("id") _id: Types.ObjectId, @Body() updateEventDto: UpdateEventDto) {
    return await this.eventsService.update(_id, updateEventDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, EventGuard)
  async remove(@Param("id") _id: Types.ObjectId) {
    return await this.eventsService.remove(_id);
  }
}
