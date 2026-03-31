import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
  @ApiProperty({
    required: true,
    description: "The name of the Permission",
    example: "CREATE",
  })
  @IsNotEmpty()
  name: string;
}
