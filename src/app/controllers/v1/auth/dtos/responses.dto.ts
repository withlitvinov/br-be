import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {}

export class LoginDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;
}

export class RefreshTokenDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;
}
