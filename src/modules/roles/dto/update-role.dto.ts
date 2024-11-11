import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateRoleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;
}
