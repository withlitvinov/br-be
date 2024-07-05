import { Module } from '@nestjs/common';

import { ProfileModel } from './models';

@Module({
  providers: [ProfileModel],
  exports: [ProfileModel],
})
export class ProfilesModule {}
