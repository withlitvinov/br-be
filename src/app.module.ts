import { Module } from '@nestjs/common';

import { PersonProfileModel } from '@/models/person-profile.model';
import { PersonProfilesControllerV1 } from './routes/v1/person-profiles.controller';
import { DbService } from './services';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController, PersonProfilesControllerV1],
  providers: [DbService, PersonProfileModel],
})
export class AppModule {}
