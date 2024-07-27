import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { ControllerVersionEnum } from '@/common';
import { TzService } from '@/modules/tz';

const PATH_PREFIX = '/tz';

@Controller({
  path: PATH_PREFIX,
  version: ControllerVersionEnum.V1,
})
export class TzControllerV1 {
  constructor(private readonly tzService: TzService) {}

  @Get()
  async allTimeZones() {
    const zones = await this.tzService.getTimeZones();

    return zones.map((zone) => ({
      id: zone.id,
      utc_offset: zone.utcOffset,
    }));
  }

  @Get('resolve_lead/:id(*)')
  async resolveLead(@Param('id') id: string) {
    const leadTimeZone = await this.tzService.resolveLeadZone(id);

    if (!leadTimeZone) {
      throw new BadRequestException(`Wrong time zone '${id}'`);
    }

    return {
      id: leadTimeZone,
    };
  }
}
