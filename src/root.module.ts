import { Module } from '@nestjs/common';

import { GlobalModule } from './common';
import { AppModule } from './app';

@Module({
  imports: [GlobalModule, AppModule],
})
export class RootModule {}
