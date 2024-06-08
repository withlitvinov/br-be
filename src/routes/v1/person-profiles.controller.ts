import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { ControllerVersion } from '@/constants/controller-version.enum';
import { PersonProfileModel } from '@/models/person-profile.model';

interface CreatePersonProfileDto {
  name: string;
  birthday: string;
}

interface UpdatePersonProfileDto {
  name?: string;
  birthday?: string;
}

@Controller({
  path: '/person_profiles',
  version: ControllerVersion.V1,
})
export class PersonProfilesControllerV1 {
  constructor(private readonly personProfileModel: PersonProfileModel) {}

  @Get()
  getAll() {
    return this.personProfileModel.all();
  }

  @Post()
  create(@Body() createPersonProfileDto: CreatePersonProfileDto) {
    return this.personProfileModel.create({
      name: createPersonProfileDto.name,
      birthday: createPersonProfileDto.birthday,
    });
  }

  @Patch(':id')
  update(
    @Param('id') personProfileId: string,
    @Body() updatePersonProfile: UpdatePersonProfileDto,
  ) {
    return this.personProfileModel.partialUpdate(personProfileId, {
      name: updatePersonProfile.name,
      birthday: updatePersonProfile.birthday,
    });
  }
}
