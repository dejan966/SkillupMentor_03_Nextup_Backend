import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    required: true,
    description: "The name of the Role",
    example: "PROGRAMER",
  })
  @IsNotEmpty()
  name: string;
}
