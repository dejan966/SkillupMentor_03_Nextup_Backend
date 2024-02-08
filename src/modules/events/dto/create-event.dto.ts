import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  max_users: number;

  @IsOptional()
  description?: string;
}
