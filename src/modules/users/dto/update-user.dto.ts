import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEmail, ValidateIf, Matches } from "class-validator";
import { Match } from "decorators/match.decorator";

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => typeof o.password === "string" && o.password.length > 0)
  @IsOptional()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      "Password must have atleast one number, lower or upper case letter and it has to be longer than five characters",
  })
  password?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => typeof o.new_password === "string" && o.new_password.length > 0)
  @IsOptional()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      "Password must have atleast one number, lower or upper case letter and it has to be longer than five characters",
  })
  new_password?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => typeof o.confirm_password === "string" && o.confirm_password.length > 0)
  @IsOptional()
  @Match(UpdateUserDto, (field) => field.new_password, {
    message: "Passwords do not match",
  })
  confirm_password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  refresh_token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  password_token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  role?: string;
}
