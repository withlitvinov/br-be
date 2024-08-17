import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';

import { ApiVersion, ControllerVersionEnum } from '@/common';
import { AuthorizedId } from '@/modules/auth';
import { TzService } from '@/modules/tz';
import { UsersService } from '@/modules/users';

import { V1_API_TAGS } from '../../../constants';

import { requests, responses } from './dtos';

const PATH_PREFIX = '/my';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiVersion(ControllerVersionEnum.V1)
@ApiTags(V1_API_TAGS.MY)
export class MyControllerV1 {
  constructor(
    private readonly usersService: UsersService,
    private readonly tzService: TzService,
  ) {}

  @ApiOperation({
    summary: "Get logged-in user's details",
  })
  @ApiOkResponse({
    type: responses.MyDto,
  })
  @ApiUnauthorizedResponse()
  @Get()
  async myDetails(
    @AuthorizedId() authorizedId: string,
  ): Promise<responses.MyDto> {
    const _user = await this.usersService.getDetails(authorizedId);

    return {
      id: _user.id,
      name: _user.name,
      email: _user.email,
      birthday: dayjs(_user.birthday).format('YYYY-MM-DD'), // TODO: Extract formatting to utils
      config: {
        time_zone: _user.config.timeZone,
      },
    };
  }

  @ApiOperation({
    summary: "Patch logged-in user's name",
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Patch('name')
  async patchName(
    @AuthorizedId() authorizedId: string,
    @Body() body: requests.PatchNameDto,
  ): Promise<void> {
    await this.usersService.updateName(authorizedId, body.name);
  }

  @ApiOperation({
    summary: "Update logged-in user's time zone",
  })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @Patch('time_zone')
  async patchTimeZone(
    @AuthorizedId() authorizedId: string,
    @Body() body: requests.PatchTimeZoneDto,
  ): Promise<void> {
    const leadTz = await this.tzService.resolveLeadZone(body.time_zone);

    if (!leadTz) {
      throw new BadRequestException(`Wrong time zone '${body.time_zone}'`);
    }

    await this.usersService.updateTimeZone(authorizedId, leadTz.id);
  }
}
