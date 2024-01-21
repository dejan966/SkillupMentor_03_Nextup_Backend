import { IsOptional } from 'class-validator';

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
}
