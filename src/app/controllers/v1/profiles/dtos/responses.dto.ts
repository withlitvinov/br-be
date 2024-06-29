import { ApiProperty } from '@nestjs/swagger';

export class GetManyProfilesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  birthday: string;

  @ApiProperty()
  is_full: boolean;
}

export class GetByIdProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  birthday: string;
}
