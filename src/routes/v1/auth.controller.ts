import { Controller } from '@nestjs/common';

import { ControllerVersion } from '@/constants/controller-version.enum';

@Controller({
  path: '/auth',
  version: ControllerVersion.V1,
})
export class AuthControllerV1 {}
