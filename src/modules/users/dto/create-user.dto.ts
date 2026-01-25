import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsEmail, Matches } from "class-validator";
import { Match } from "decorators/match.decorator";
import { Types } from "mongoose";

export class CreateUserDto {
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
    required: false,
    description: "Firebase UID",
  })
  @IsOptional()
  uid?: string;

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
    description: "Password which the user will set for his account",
    example: "ExamplePassword123!",
  })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      "Password must have atleast one number, lower or upper case letter and it has to be longer than five characters",
  })
  password: string;

  @ApiProperty({
    required: true,
    description: "User retypes the password which he set",
    example: "ExampleConfirmPassword123!",
  })
  @IsNotEmpty()
  @Match(CreateUserDto, (field) => field.password, {
    message: "Passwords do not match",
  })
  confirm_password: string;

  @ApiProperty({
    required: true,
    description: "The users role",
    example: "PROGRAMER",
  })
  @IsNotEmpty()
  role: Types.ObjectId;
}
