import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ControllerVersionEnum, parseUuid } from '@/common';
import { ProfilesOrderEnum, ProfileModel } from '@/profiles';

import { CreateProfileDto } from './dtos/profiles-crud.dto';

const PATH_PREFIX = '/profiles';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
export class ProfilesCrudControllerV1 {
  constructor(private readonly profileModel: ProfileModel) {}

  @Get()
  getMany() {
    return this.profileModel.getMany({
      order: ProfilesOrderEnum.UpcomingBirthday,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    const uuid = parseUuid(id);
    return this.profileModel.getById(uuid);
  }

  @Post()
  createOne(@Body() createProfileDto: CreateProfileDto) {
    const { name, birthday } = createProfileDto;

    return this.profileModel.insertOne({
      name,
      birthday: {
        year: birthday.year,
        month: birthday.month,
        day: birthday.day,
      },
    });
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    const uuid = parseUuid(id);
    return this.profileModel.deleteById(uuid);
  }
}
