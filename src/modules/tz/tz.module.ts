import { Module } from '@nestjs/common';

import { TzService } from './tz.service';

@Module({
  providers: [TzService],
  exports: [TzService],
})
export class TzModule {}
