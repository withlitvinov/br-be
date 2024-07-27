import { RedocModule, RedocOptions } from '@jozefazz/nestjs-redoc';
import {
  INestApplication,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { type RouteInfo } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { NEUTRAL_API_TAGS, V1_API_TAGS } from '@/app/constants';

import { RootModule } from './root.module';

const GLOBAL_PREFIX = '/api';
const EXCLUDED_FROM_GLOBAL_PREFIX: RouteInfo[] = [
  {
    path: '/',
    method: RequestMethod.GET,
  },
];

// Check Intl support
if (typeof Intl.supportedValuesOf === 'undefined') {
  throw new Error('Intl.supportedValuesOf() is not supported');
}

export async function setupRedoc(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Birthday Reminder API documentation')
    .setVersion('1.0');

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  const redocOptions: RedocOptions = {
    title: 'Birthday Reminder API documentation',
    sortPropsAlphabetically: false,
    hideDownloadButton: true,
    noAutoAuth: true,
    pathInMiddlePanel: false,
    disableSearch: true,
    tagGroups: [
      { name: 'Version neutral', tags: Object.values(NEUTRAL_API_TAGS) },
      { name: 'Version 1', tags: Object.values(V1_API_TAGS) },
    ],
  };
  await RedocModule.setup('/docs', app, document, redocOptions);
}

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const configService = app.get(ConfigService);

  const host = configService.get('APP__HOST');
  const port = +configService.get('APP__PORT');
  const corsOrigin = configService.get<string>('CORS__ORIGIN').split(',');

  app.enableCors({
    credentials: true,
    origin: corsOrigin,
  }); // TODO: Configure for production
  app.use(cookieParser());
  app.setGlobalPrefix(GLOBAL_PREFIX, {
    exclude: EXCLUDED_FROM_GLOBAL_PREFIX,
  });
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-Version',
  });

  await setupRedoc(app);

  await app.listen(port, host);
}

bootstrap();
