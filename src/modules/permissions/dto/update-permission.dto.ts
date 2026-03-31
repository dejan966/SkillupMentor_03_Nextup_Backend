import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class UpdatePermissionDto {
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    example: "PROGRAMER",
  })
  @IsNotEmpty()
  role: Types.ObjectId;
}
