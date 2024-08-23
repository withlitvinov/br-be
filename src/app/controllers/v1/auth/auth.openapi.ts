import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { V1_API_TAGS } from '@/app/constants';
import { ApiVersion, ControllerVersionEnum } from '@/common';

import { requests, responses } from './dtos';

const ControllerOpenApi = applyDecorators(
  ApiVersion(ControllerVersionEnum.V1),
  ApiTags(V1_API_TAGS.AUTH),
);

const RegisterOpenApi = applyDecorators(
  ApiOperation({
    summary: 'Register new user',
  }),
  ApiBody({
    type: requests.RegisterDto,
  }),
  ApiOkResponse(),
  ApiConflictResponse(),
  ApiBadRequestResponse,
);

const LoginOpenApi = applyDecorators(
  ApiOperation({
    summary: 'Login',
  }),
  ApiBody({
    type: requests.LoginDto,
  }),
  ApiOkResponse({
    type: responses.LoginDto,
  }),
);

const LogoutOpenApi = applyDecorators(
  ApiOperation({
    summary: 'Logout',
  }),
);

const RefreshSessionOpenApi = applyDecorators(
  ApiOperation({
    summary: 'Refresh session',
  }),
  ApiOkResponse({
    type: responses.RefreshTokenDto,
  }),
);

export {
  ControllerOpenApi,
  RegisterOpenApi,
  LoginOpenApi,
  LogoutOpenApi,
  RefreshSessionOpenApi,
};
