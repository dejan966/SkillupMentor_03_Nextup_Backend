import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProviderDataDto {
  @ApiProperty({
    required: true,
    description: "Authentication provider ID (e.g. google.com)",
  })
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({
    required: true,
    description: "Provider-specific user UID",
  })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    required: true,
    description: "User display name from the provider",
  })
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    required: true,
    description: "User email from the provider",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    description: "User phone number from the provider",
  })
  @IsOptional()
  phoneNumber?: string | null;

  @ApiProperty({
    required: true,
    description: "User profile photo URL from the provider",
  })
  @IsNotEmpty()
  photoURL: string;
}
