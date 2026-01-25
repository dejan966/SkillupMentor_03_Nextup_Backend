import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    required: true,
    description: "The users email",
    example: "john.smith@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: "Password which the user has set for his account",
    example: "Example password",
  })
  @IsNotEmpty()
  password: string;
}
