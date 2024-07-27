import { ApiProperty } from '@nestjs/swagger';

class MyConfigDto {
  @ApiProperty()
  time_zone: string;
}

class MyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  config: MyConfigDto;
}

export { MyConfigDto, MyDto };
