import { ApiProperty } from '@nestjs/swagger';

class RegisterDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  birthday: string;
}

class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export { RegisterDto, LoginDto };
