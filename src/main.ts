import { NestFactory } from '@nestjs/core';
import { RequestMethod, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';

const APP_PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
