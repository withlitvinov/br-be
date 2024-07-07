import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth';
import { ProfilesModule } from '@/modules/profiles';

import { RootControllerNeutral } from './neutral/root.controller';
import { AuthControllerV1 } from './v1/auth/auth.controller';
import { ProfilesCrudControllerV1 } from './v1/profiles/profiles-crud.controller';

const NEUTRAL_CONTROLLERS = [RootControllerNeutral];
const V1_CONTROLLERS = [AuthControllerV1, ProfilesCrudControllerV1];

@Module({
  imports: [AuthModule, ProfilesModule],
  controllers: [...NEUTRAL_CONTROLLERS, ...V1_CONTROLLERS],
})
export class ControllersModule {}
