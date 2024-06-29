import { ApiProperty } from '@nestjs/swagger';

export class BirthdayDto {
  @ApiProperty({
    example: 14,
  })
  day: number;

  @ApiProperty({
    example: 3,
  })
  month: number;

  @ApiProperty({
    example: 1998,
    nullable: true,
  })
  year: number | null;
}

export class CreateOneProfileRequestDto {
  @ApiProperty({
    example: 'Garry',
  })
  name: string;

  @ApiProperty()
  birthday: BirthdayDto;
}
