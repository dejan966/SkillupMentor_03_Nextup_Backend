import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreatePermissionDto {
  @ApiProperty({
    required: true,
    description: "The name of the Permission",
    example: "CREATE",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: "The description of the permission",
    example: "bla bla",
  })
  @IsOptional()
  description: string;
}
