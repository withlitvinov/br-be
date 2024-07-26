import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';

import { ControllerVersionEnum } from '@/common';
import { DJwtPayload, JwtPayload } from '@/modules/auth';
import { TzService } from '@/modules/tz';
import { UsersService } from '@/modules/users';

import { V1_API_TAGS } from '../../../constants';

import { requests, responses } from './dtos';

const PATH_PREFIX = '/my';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.AUTH)
export class MyControllerV1 {
  constructor(
    private readonly usersService: UsersService,
    private readonly tzService: TzService,
  ) {}

  @ApiOperation({
    summary: "Get logged-in user's details",
  })
  @Get()
  async myDetails(
    @DJwtPayload() jwtPayload: JwtPayload,
  ): Promise<responses.MyDto> {
    const _user = await this.usersService.getDetails(jwtPayload.id);

    return {
      id: _user.id,
      name: _user.name,
      email: _user.email,
      birthday: dayjs(_user.birthday).format('YYYY-MM-DD'), // TODO: Extract formatting to utils
      time_zone: _user.config.timeZone,
    };
  }

  @ApiOperation({
    summary: "Update logged-in user's time zone",
  })
  @Patch('time_zone')
  async patchTimeZone(
    @DJwtPayload() jwtPayload: JwtPayload,
    @Body() body: requests.UpdateTimeZoneDto,
  ): Promise<void> {
    const leadTimeZone = await this.tzService.resolveLeadZone(body.time_zone);

    if (!leadTimeZone) {
      throw new BadRequestException(`Wrong time zone '${body.time_zone}'`);
    }

    await this.usersService.updateTimeZone(jwtPayload.id, leadTimeZone);
  }
}
