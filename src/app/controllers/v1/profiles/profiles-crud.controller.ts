import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { ControllerVersionEnum, parseUuid } from '@/common';
import {
  BirthdayMarkerEnum,
  ProfileModel,
  ProfilesOrderEnum,
} from '@/profiles';

import type {
  CreateOneProfileRequestDto,
  GetManyProfilesResponseDto,
  GetByIdProfileResponseDto,
  CreateOneProfileResponseDto,
  DeleteByIdProfileResponseDto,
} from './dtos';

const PATH_PREFIX = '/profiles';

const formatDate = (date: Date, isWithoutYear = false) =>
  dayjs(date).format(isWithoutYear ? 'MM-DD' : 'YYYY-MM-DD');

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
export class ProfilesCrudControllerV1 {
  constructor(private readonly profileModel: ProfileModel) {}

  @Get()
  async getMany(): Promise<GetManyProfilesResponseDto> {
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
  async createOne(
    @Body() dto: CreateOneProfileRequestDto,
  ): Promise<CreateOneProfileResponseDto> {
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
  async deleteById(
    @Param('id') id: string,
  ): Promise<DeleteByIdProfileResponseDto> {
    const uuid = parseUuid(id);
    await this.profileModel.deleteById(uuid);
  }
}
