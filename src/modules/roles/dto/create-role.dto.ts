import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;
}
