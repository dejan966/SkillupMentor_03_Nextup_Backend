import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class CreateRolesPermissionDto {
  @ApiProperty({
    required: true,
    description: "The name of the Role",
    example: "PROGRAMER",
  })
  @IsNotEmpty()
  role: Types.ObjectId;

  @ApiProperty({
    required: true,
    description: "The name of the Permissions",
    example: "CREATE",
  })
  @IsNotEmpty()
  permission: Types.ObjectId;

  @ApiProperty({
    required: true,
    description: "Who granted the role",
  })
  @IsNotEmpty()
  granted_by: Types.ObjectId;

  @ApiProperty({
    required: false,
    description: "When it expires",
  })
  @IsOptional()
  expires_at: Date;
}
