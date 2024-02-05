import { IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  name: string;
}
