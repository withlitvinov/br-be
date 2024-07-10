import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';

import { V1_API_TAGS } from '@/app/constants';
import { ApiVersion, ControllerVersionEnum, parseUuid } from '@/common';
import {
  BirthdayMarkerEnum,
  ProfileModel,
  ProfilesOrderEnum,
} from '@/modules/profiles';

import {
  CreateOneProfileRequestDto,
  GetByIdProfileResponseDto,
  GetManyProfilesResponseDto,
} from './dtos';

const PATH_PREFIX = '/profiles';

const formatDate = (date: Date, isWithoutYear = false) =>
  dayjs(date).format(isWithoutYear ? 'MM-DD' : 'YYYY-MM-DD');

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.PROFILE)
@ApiVersion(ControllerVersionEnum.V1)
export class ProfilesCrudControllerV1 {
  constructor(private readonly profileModel: ProfileModel) {}

  @Get()
  @ApiOperation({
    summary: 'Get profiles',
  })
  @ApiOkResponse({
    type: [GetManyProfilesResponseDto],
  })
  async getMany(): Promise<GetManyProfilesResponseDto[]> {
    const profiles = await this.profileModel.getMany({
      order: ProfilesOrderEnum.UpcomingBirthday,
    });

    return profiles.map((profile) => {
      const isFullBirthday =
        profile.birthdayMarker === BirthdayMarkerEnum.Standard;

      return {
        id: profile.id,
        name: profile.name,
        birthday: formatDate(profile.birthday, !isFullBirthday),
        is_full: isFullBirthday,
      };
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by id',
  })
  @ApiParam({
    name: 'id',
    type: 'uuid',
  })
  @ApiOkResponse({
    type: GetByIdProfileResponseDto,
  })
  async getById(@Param('id') id: string): Promise<GetByIdProfileResponseDto> {
    const uuid = parseUuid(id);
    const profile = await this.profileModel.getById(uuid);

    return {
      id: profile.id,
      name: profile.name,
      birthday: formatDate(
        profile.birthday,
        profile.birthdayMarker === BirthdayMarkerEnum.WithoutYear,
      ),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create profile',
  })
  @ApiBody({
    type: CreateOneProfileRequestDto,
  })
  async createOne(@Body() dto: CreateOneProfileRequestDto): Promise<void> {
    const { name, birthday } = dto;
    await this.profileModel.insertOne({
      name,
      birthday: {
        year: birthday.year,
        month: birthday.month,
        day: birthday.day,
      },
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete profile by id',
  })
  @ApiParam({
    name: 'id',
    type: 'uuid',
  })
  async deleteById(@Param('id') id: string): Promise<void> {
    const uuid = parseUuid(id);
    await this.profileModel.deleteById(uuid);
  }
}
