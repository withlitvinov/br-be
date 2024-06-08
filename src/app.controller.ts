import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  welcome() {
    return "Welcome to the Birthday Reminder's server.\nYou can find our website by url https://birthday-reminder.withlitvinov.com.";
  }
}
