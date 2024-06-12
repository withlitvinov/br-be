import { Module } from '@nestjs/common';

import { ProfilesModule } from '@/profiles';

import { RootControllerNeutral } from './neutral/root.controller';
import { ProfilesCrudControllerV1 } from './v1/profiles/profiles-crud.controller';

const NEUTRAL_CONTROLLERS = [RootControllerNeutral];
const V1_CONTROLLERS = [ProfilesCrudControllerV1];

@Module({
  imports: [ProfilesModule],
  controllers: [...NEUTRAL_CONTROLLERS, ...V1_CONTROLLERS],
})
export class ControllersModule {}
