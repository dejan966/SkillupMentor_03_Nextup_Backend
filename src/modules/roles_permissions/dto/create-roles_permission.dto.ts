import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateRolesPermissionDto {
  @ApiProperty({
    required: true,
    description: "The name of the Role",
    example: "PROGRAMER",
  })
  @IsNotEmpty()
  role_id: Types.ObjectId;

  @ApiProperty({
    required: true,
    description: "The name of the Permissions",
    example: "CREATE",
  })
  @IsNotEmpty()
  permission_id: Types.ObjectId;
}
