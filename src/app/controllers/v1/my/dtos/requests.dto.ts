import { ApiProperty } from '@nestjs/swagger';

class PatchNameDto {
  @ApiProperty()
  name: string;
}

class PatchTimeZoneDto {
  @ApiProperty()
  time_zone: string;
}

export { PatchNameDto, PatchTimeZoneDto };
