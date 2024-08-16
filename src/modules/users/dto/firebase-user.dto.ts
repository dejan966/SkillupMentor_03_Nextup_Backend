import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class FirebaseUserDto {
  @IsOptional()
  first_name?: string;

  @IsOptional()
  last_name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  uid: string;

  @IsNotEmpty()
  avatar: string;

  @IsOptional()
  refresh_token?: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirm_password: string;
}
