import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
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
    required: true,
    description: "The role to which you assign the permission",
    example: "PROGRAMER",
  })
  @IsNotEmpty()
  role: Types.ObjectId;
}
