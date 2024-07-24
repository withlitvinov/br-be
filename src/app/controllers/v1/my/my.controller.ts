import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { Request } from 'express';

import { ControllerVersionEnum } from '@/common';
import { UsersService } from '@/modules/users';

import { V1_API_TAGS } from '../../../constants';

import { responses } from './dtos';

const PATH_PREFIX = '/my';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.AUTH)
export class MyControllerV1 {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "Get logged-in user's details",
  })
  @Get()
  async myDetails(@Req() req: Request): Promise<responses.MyDto> {
    const user = await this.usersService.getDetails(
      (req.user as { id: string }).id,
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: dayjs(user.birthday).format('YYYY-MM-DD'), // TODO: Extract formatting to utils
      time_zone: user.config.timeZone,
    };
  }
}
