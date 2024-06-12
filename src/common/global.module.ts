import { Global, Module } from '@nestjs/common';

import { DbService } from './services';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
})
export class GlobalModule {}
