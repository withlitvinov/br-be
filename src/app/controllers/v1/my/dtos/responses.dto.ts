import { ApiProperty } from '@nestjs/swagger';
import { NIL } from 'uuid';

class MyConfigDto {
  @ApiProperty({
    example: 'Europe/London',
  })
  time_zone: string;
}

class MyDto {
  @ApiProperty({
    example: NIL,
  })
  id: string;

  @ApiProperty({
    example: 'George Clooney',
  })
  name: string;

  @ApiProperty({
    example: 'george.clooney@withlitviniv.com',
  })
  email: string;

  @ApiProperty({
    example: '1961-05-06',
  })
  birthday: string;

  @ApiProperty()
  config: MyConfigDto;
}

export { MyConfigDto, MyDto };
