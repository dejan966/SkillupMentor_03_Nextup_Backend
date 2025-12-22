import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class FirebaseUserDto {
  @ApiProperty({
    required: false,
    description: "The users first name",
    example: "John",
  })
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    required: false,
    description: "The users last name",
    example: "Smith",
  })
  @IsOptional()
  last_name?: string;

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
    description: "The users firebase id",
  })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    required: true,
    description: "The users profile picture",
    example: "image.jpg",
  })
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({
    required: false,
    description: "The token which is required for users login session",
  })
  @IsOptional()
  refresh_token?: string;

  @ApiProperty({
    required: true,
    description: "User type",
    example: "Nextup user",
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    required: true,
    description: "Password which the user will set for his account",
    example: "ExamplePassword123!",
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
    description: "User retypes the password which he set",
    example: "ExampleConfirmPassword123!",
  })
  @IsNotEmpty()
  confirm_password: string;
}
