import { ApiProperty } from '@nestjs/swagger';

class ProfileDto {
  @ApiProperty({
    type: 'uuid',
    description: 'ID',
    example: 'f537d724-393b-469c-87f5-e6bcd8d601bb',
  })
  id: string;

  @ApiProperty({
    description: "Person's name",
    example: 'Garry',
  })
  name: string;

  @ApiProperty({
    description:
      'A formatted date of birth. Example: Full date - 1998-06-20; Without year - ####-06-20',
    example: '1998-06-20',
  })
  birthday: string;

  @ApiProperty({
    description:
      'Indicates date integrity, true value means that birth date with year',
    example: true,
  })
  is_full: boolean;
}

export { ProfileDto };
