import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { ControllerVersionEnum } from '@/common';
import { TzService } from '@/modules/tz';

import { response } from './dtos';

const PATH_PREFIX = '/tz';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
export class TzControllerV1 {
  constructor(private readonly tzService: TzService) {}

  @Get()
  async allTimeZones(): Promise<response.TZDto[]> {
    const zones = await this.tzService.getTimeZones();

    return zones.map((zone) => ({
      id: zone.id,
      utc_offset: zone.utcOffset,
    }));
  }

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
