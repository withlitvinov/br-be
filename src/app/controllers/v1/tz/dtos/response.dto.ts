import { ApiProperty } from '@nestjs/swagger';

class TZDto {
  @ApiProperty({
    description: 'Time zone unique identifier',
    example: 'Europe/Kyiv',
  })
  id: string;

  @ApiProperty({
    description: 'UTC offset',
    example: 10800,
  })
  utc_offset: number;
}

export { TZDto };
