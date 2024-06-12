import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ControllerVersionEnum, type Uuid } from '@/common';
import { GetManyOrderEnum, ProfileModel } from '@/profiles';

import { CreateProfileDto, UpdateProfileDto } from './dtos/profiles-crud.dto';

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
      order: GetManyOrderEnum.UpcomingBirthday,
    });
  }

  @Get(':id')
  getById(@Param('id') id: Uuid) {
    return this.profileModel.getById(id);
  }

  @Post()
  createOne(@Body() createProfileDto: CreateProfileDto) {
    const birthday = new Date(createProfileDto.birthday);

    return this.profileModel.insertOne({
      name: createProfileDto.name,
      birthday,
    });
  }

  @Patch(':id')
  updateById(
    @Param('id') id: Uuid,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const birthday = new Date(updateProfileDto.birthday);

    return this.profileModel.partialUpdateById(id, {
      name: updateProfileDto.name,
      birthday,
    });
  }

  @Delete(':id')
  deleteById(@Param('id') id: Uuid) {
    return this.profileModel.deleteById(id);
  }
}
