import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth';
import { ProfilesModule } from '@/modules/profiles';
import { TzModule } from '@/modules/tz';
import { UsersModule } from '@/modules/users';

import { RootControllerNeutral } from './neutral/root.controller';
import { AuthControllerV1 } from './v1/auth/auth.controller';
import { MyControllerV1 } from './v1/my/my.controller';
import { ProfilesControllerV1 } from './v1/profiles/profiles.controller';
import { TzControllerV1 } from './v1/tz/tz.controller';

const NEUTRAL_CONTROLLERS = [RootControllerNeutral];
const V1_CONTROLLERS = [
  AuthControllerV1,
  ProfilesControllerV1,
  MyControllerV1,
  TzControllerV1,
];

@Module({
  imports: [AuthModule, ProfilesModule, UsersModule, TzModule],
  controllers: [...NEUTRAL_CONTROLLERS, ...V1_CONTROLLERS],
})
export class ControllersModule {}
