import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEventDto {
  @ApiProperty({
    required: true,
    description: "The name of the event",
    example: "Annual Tech Conference",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: "The location of the event",
    example: "Georgia",
  })
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    required: true,
    description: "Maximum number of attendees",
    example: 1000,
  })
  @IsNotEmpty()
  max_users: number;

  @ApiProperty({
    required: false,
    description: "The description of the event",
    example: "This will be a great event. Definitely not boring",
  })
  @IsOptional()
  description?: string;
}
