import { IsArray, IsBoolean, IsEmail, IsNotEmpty, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ProviderDataDto } from "./provider-data.dto";
import { StsTokenManagerDto } from "./sts-token-manager.dto";

export class FirebaseUserDto {
  @ApiProperty({
    required: true,
    description: "Firebase UID of the authenticated user",
  })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({
    required: true,
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: "Whether the email is verified in Firebase",
  })
  @IsNotEmpty()
  emailVerified: boolean;

  @ApiProperty({
    required: true,
    description: "User display name",
  })
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    required: true,
    description: "Whether the user signed in anonymously",
  })
  @IsBoolean()
  isAnonymous: boolean;

  @ApiProperty({
    required: true,
    description: "User profile photo URL",
  })
  @IsNotEmpty()
  photoURL: string;

  @ApiProperty({
    required: true,
    description: "List of authentication provider data",
    type: [ProviderDataDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProviderDataDto)
  providerData: ProviderDataDto[];

  @ApiProperty({
    required: true,
    description: "Firebase STS token manager data",
    type: StsTokenManagerDto,
  })
  @ValidateNested()
  @Type(() => StsTokenManagerDto)
  stsTokenManager: StsTokenManagerDto;

  @ApiProperty({
    required: true,
    description: "Account creation timestamp (string from Firebase)",
  })
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({
    required: true,
    description: "Last login timestamp (string from Firebase)",
  })
  @IsNotEmpty()
  lastLoginAt: string;

  @ApiProperty({
    required: true,
    description: "Firebase API key used by the client",
  })
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({
    required: true,
    description: "Firebase app name",
  })
  @IsNotEmpty()
  appName: string;
}
