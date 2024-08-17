import { Module } from '@nestjs/common';

import { ControllersModule } from './controllers';
import { RecurringModule } from './recurring';

@Module({
  imports: [ControllersModule, RecurringModule],
})
export class AppModule {}
