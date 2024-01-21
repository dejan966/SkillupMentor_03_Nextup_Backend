import { IsNotEmpty, IsOptional } from "class-validator";
import { User } from "schemas/user.schema";

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  max_users: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  image?: string;

  creator: User;
}
