import { ApiHeader } from '@nestjs/swagger';

import { ControllerVersionEnum, Header } from '@/common';

export function ApiVersion(version: ControllerVersionEnum) {
  return ApiHeader({
    name: Header.XVersion,
    required: true,
    schema: {
      type: version,
    },
  });
}
