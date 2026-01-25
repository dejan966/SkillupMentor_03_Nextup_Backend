import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { User } from "schemas/user.schema";

export class UpdateEventDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  max_users?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  booked_users: User[];
}
