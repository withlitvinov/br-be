import { ApiProperty } from '@nestjs/swagger';

class BirthdayDto {
  @ApiProperty({
    description: 'A day of birth',
    example: 14,
  })
  day: number;

  @ApiProperty({
    description: 'A month of birth',
    example: 3,
  })
  month: number;

  @ApiProperty({
    description: 'A year of birth',
    example: 1998,
    nullable: true,
  })
  year: number | null;
}

class CreateOneProfileRequestDto {
  @ApiProperty({
    example: 'Garry',
    description: "Person's name",
  })
  name: string;

  @ApiProperty()
  birthday: BirthdayDto;
}

export { BirthdayDto, CreateOneProfileRequestDto };
