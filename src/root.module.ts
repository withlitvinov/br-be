import { Module } from '@nestjs/common';

import { AppModule } from './app';
import { GlobalModule } from './common';

@Module({
  imports: [GlobalModule, AppModule],
  providers: [],
})
export class RootModule {}
