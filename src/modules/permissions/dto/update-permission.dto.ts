import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class UpdatePermissionDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    example: "bla bla",
  })
  @IsOptional()
  description: string;
}
