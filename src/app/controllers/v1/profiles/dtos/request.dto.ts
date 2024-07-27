import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    example: 'Garry',
    description: "Person's name",
  })
  name: string;

  @ApiProperty({
    description: 'A formatted date of birth',
    example: '1998-06-14',
  })
  birthday: string;
}

export { CreateDto };
