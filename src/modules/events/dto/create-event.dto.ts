import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEventDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  location: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  max_users: number;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;
}
