import { ApiProperty } from '@nestjs/swagger';

class RegisterDto {}

class LoginDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;
}

class RefreshTokenDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;
}

export { RegisterDto, LoginDto, RefreshTokenDto };
