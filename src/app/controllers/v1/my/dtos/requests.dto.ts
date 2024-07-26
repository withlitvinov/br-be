import { ApiProperty } from '@nestjs/swagger';

export class UpdateTimeZoneDto {
  @ApiProperty()
  time_zone: string;
}
