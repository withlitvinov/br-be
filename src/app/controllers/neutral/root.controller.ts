import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NEUTRAL_API_TAGS } from '@/app/constants';
import { Public } from '@/modules/auth';

const PATH_PREFIX = '/';
const WELCOME_MESSAGE =
  "Welcome to the Birthday Reminder's server.</br>You can find our website by url https://birthday-reminder.withlitvinov.com.";

@Public()
@Controller({
  path: PATH_PREFIX,
  version: VERSION_NEUTRAL,
})
@ApiTags(NEUTRAL_API_TAGS.ROOT)
export class RootControllerNeutral {
  @Get()
  @ApiOperation({
    summary: 'Welcome message',
  })
  @ApiOkResponse({
    schema: {
      type: 'string',
      example: WELCOME_MESSAGE,
    },
  })
  welcome() {
    return WELCOME_MESSAGE;
  }
}
