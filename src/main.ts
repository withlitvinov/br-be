import { NestFactory } from '@nestjs/core';
import {
  INestApplication,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { type RouteInfo } from '@nestjs/common/interfaces';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from '@jozefazz/nestjs-redoc';
import * as cookieParser from 'cookie-parser';

import { NEUTRAL_API_TAGS, V1_API_TAGS } from '@/app/constants';

import { RootModule } from './root.module';

const APP_PORT = 4000;
const APP_HOST = '127.0.0.1';
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

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:5173'],
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

  await app.listen(APP_PORT, APP_HOST);
}

bootstrap();
