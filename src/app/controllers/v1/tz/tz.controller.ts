import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { V1_API_TAGS } from '@/app/constants';
import { ControllerVersionEnum } from '@/common';
import { TzService } from '@/modules/tz';

import { response } from './dtos';

const PATH_PREFIX = '/tz';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
@ApiTags(V1_API_TAGS.TZ)
export class TzControllerV1 {
  constructor(private readonly tzService: TzService) {}

  @ApiOperation({
    summary: 'Get time zone list',
  })
  @ApiOkResponse({
    type: [response.TZDto],
  })
  @Get()
  async allTimeZones(): Promise<response.TZDto[]> {
    const zones = await this.tzService.getTimeZones();

    return zones.map((zone) => ({
      id: zone.id,
      utc_offset: zone.utcOffset,
    }));
  }

  @ApiOperation({
    summary: 'Resolve lead time zone',
    description:
      'Occasionally, time zone configurations may become outdated or misconfigured. For example, the time zone "Europe/Kiev" has recently been updated to "Europe/Kyiv." Not all systems may have adopted this change, potentially leading to inconsistencies.\n' +
      '\n' +
      'To address this, you can use the provided endpoint to resolve the leading zone that is currently accurate. This endpoint helps ensure your system reflects the most up-to-date time zone information.',
  })
  @ApiOkResponse({
    type: response.TZDto,
  })
  @ApiBadRequestResponse()
  @Get('resolve_lead/:id(*)')
  async resolveLead(@Param('id') id: string): Promise<response.TZDto> {
    const leadTz = await this.tzService.resolveLeadZone(id);

    if (!leadTz) {
      throw new BadRequestException(`Wrong time zone '${id}'`);
    }

    return {
      id: leadTz.id,
      utc_offset: leadTz.utcOffset,
    };
  }
}
