import * as fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { DbService } from '@/common';

const ZONES_FILE_PATH = process.env.PWD + '/src/static/zones.json';

type PgZone = {
  id: string;
  utc_offset: string;
};

type Zone = {
  id: string;
  utcOffset: number;
};

type CachedZone = {
  id: string;
  aliases: string[] | null;
};

@Injectable()
export class TzService {
  private version = '';
  private cachedZones: CachedZone[] = [];

  constructor(private readonly dbService: DbService) {}

  private async loadIanaZones() {
    if (this.cachedZones.length > 0) {
      return this.cachedZones;
    }

    const staticZones = JSON.parse(await fs.readFile(ZONES_FILE_PATH, 'utf-8'));
    this.version = staticZones.version;
    this.cachedZones = staticZones.zones;

    return this.cachedZones;
  }

  async getTimeZones() {
    const pgZones = await this.dbService.$queryRawUnsafe<PgZone[]>(
      'select name as id, utc_offset::text from pg_timezone_names',
    );

    const ianaZones = await this.loadIanaZones();

    const zones = pgZones.filter((pgTz) =>
      ianaZones.find((tz) => tz.id === pgTz.id),
    );

    let _zones = zones.map(this.parsePgZone);
    _zones = _zones.sort((a, b) => b.utcOffset - a.utcOffset);

    return _zones;
  }

  async getTimeZone(id: string) {
    const ianaZones = await this.loadIanaZones();

    if (!ianaZones.find((tz) => tz.id === id)) {
      return null;
    }

    const [pgZone] = await this.dbService.$queryRawUnsafe<PgZone[]>(
      `select name as id, utc_offset::text from pg_timezone_names where id = '${id}'`,
    );

    return this.parsePgZone(pgZone);
  }

  async resolveLeadZone(id: string) {
    const ianaZones = await this.loadIanaZones();

    for (const zone of ianaZones) {
      if (zone.id === id || (zone.aliases && zone.aliases.includes(id))) {
        return zone.id;
      }
    }

    return null;
  }

  private parsePgZone(pgZone: PgZone): Zone {
    const [h, m, s] = pgZone.utc_offset.split(':').map(Number);
    const secs = h * 60 * 60 + m * 60 + s;

    return {
      id: pgZone.id,
      utcOffset: secs,
    };
  }
}
