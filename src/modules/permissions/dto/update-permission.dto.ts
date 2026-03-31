import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdatePermissionDto {
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  name: string;
}
