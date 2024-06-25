import { NestFactory } from '@nestjs/core';
import { RequestMethod, VersioningType } from '@nestjs/common';

import { RootModule } from './root.module';

const APP_PORT = 4000;

// Check Intl support
if (typeof Intl.supportedValuesOf === 'undefined') {
  throw new Error('Intl.supportedValuesOf() is not supported');
}

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.enableCors(); // TODO: Configure for production
  app.setGlobalPrefix('/api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
  });

  await app.listen(APP_PORT);
}
bootstrap();
