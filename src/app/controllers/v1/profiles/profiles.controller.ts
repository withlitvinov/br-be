import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
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
import { AuthorizedId } from '@/modules/auth';
import {
  BirthdayMarkerEnum,
  ProfilesOrderEnum,
  ProfilesService,
} from '@/modules/profiles';
import { UsersService } from '@/modules/users';

import { request, response } from './dtos';

const PATH_PREFIX = '/profiles';

const formatDate = (date: Date, isWithoutYear = false) =>
  dayjs(date).format(isWithoutYear ? 'MM-DD' : 'YYYY-MM-DD');

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.PROFILE)
@ApiVersion(ControllerVersionEnum.V1)
export class ProfilesControllerV1 {
  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get profiles',
  })
  @ApiOkResponse({
    type: [response.ProfileDto],
  })
  async getMany(
    @AuthorizedId() authorizedId: string,
  ): Promise<response.ProfileDto[]> {
    const userTz = await this.usersService.getTimeZone(authorizedId);

    const profiles = await this.profilesService.getMany({
      userId: authorizedId,
      order: ProfilesOrderEnum.Upcoming,
      tz: userTz ?? undefined,
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
    type: response.ProfileDto,
  })
  async getById(
    @AuthorizedId() authorizedId: string,
    @Param('id') id: string,
  ): Promise<response.ProfileDto> {
    const uuid = parseUuid(id);

    const isBelongToUser = await this.profilesService.isBelongToUser(
      id,
      authorizedId,
    );

    if (!isBelongToUser) {
      throw new NotFoundException();
    }

    const profile = await this.profilesService.get(uuid);
    const isYear = profile.birthdayMarker === BirthdayMarkerEnum.Standard;

    return {
      id: profile.id,
      name: profile.name,
      birthday: formatDate(profile.birthday, !isYear),
      is_full: isYear,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create profile',
  })
  @ApiBody({
    type: request.CreateDto,
  })
  async createOne(
    @AuthorizedId() authorizedId: string,
    @Body() dto: request.CreateDto,
  ): Promise<void> {
    const { name, birthday } = dto;

    await this.profilesService.create(authorizedId, {
      name,
      birthday,
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
  async deleteById(
    @AuthorizedId() authorizedId: string,
    @Param('id') id: string,
  ): Promise<void> {
    const uuid = parseUuid(id);

    const isBelongToUser = await this.profilesService.isBelongToUser(
      id,
      authorizedId,
    );

    if (!isBelongToUser) {
      throw new NotFoundException();
    }

    await this.profilesService.delete(uuid);
  }
}
