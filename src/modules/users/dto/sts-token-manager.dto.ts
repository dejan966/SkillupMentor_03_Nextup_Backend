import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class StsTokenManagerDto {
  @ApiProperty({
    required: true,
    description: "Firebase refresh token",
  })
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    required: true,
    description: "Firebase access token",
  })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    required: true,
    description: "Access token expiration time (epoch milliseconds)",
  })
  @IsNotEmpty()
  expirationTime: number;
}
