import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Types } from "mongoose";

export class UpdateRolesPermissionDto {
  @ApiProperty({
    required: false,
    description: "The name of the Role",
    example: "PROGRAMER",
  })
  @IsOptional()
  role?: Types.ObjectId;

  @ApiProperty({
    required: false,
    description: "The name of the Permissions",
    example: "CREATE",
  })
  @IsOptional()
  permission?: Types.ObjectId;
}
