import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DbService } from './services';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class GlobalModule {}
