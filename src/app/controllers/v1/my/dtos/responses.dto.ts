import { ApiProperty } from '@nestjs/swagger';

export class MyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  birthday: string;
}
