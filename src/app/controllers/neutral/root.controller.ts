import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

const PATH_PREFIX = '/';
const WELCOME_MESSAGE =
  "Welcome to the Birthday Reminder's server.</br>You can find our website by url https://birthday-reminder.withlitvinov.com.";

@Controller({
  path: PATH_PREFIX,
  version: VERSION_NEUTRAL,
})
export class RootControllerNeutral {
  @Get()
  welcome() {
    return WELCOME_MESSAGE;
  }
}
