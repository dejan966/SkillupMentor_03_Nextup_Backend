import { IsOptional } from 'class-validator';
import { User } from 'schemas/user.schema';

export class UpdateEventDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  max_users?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  booked_users: User[];
}
