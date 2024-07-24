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

@Injectable()
export class TzService {
  private version = '';
  private timeZones: string[] = [];

  constructor(private readonly dbService: DbService) {}

  private async loadIanaZones() {
    if (this.timeZones.length > 0) {
      return this.timeZones;
    }

    const staticZones = JSON.parse(await fs.readFile(ZONES_FILE_PATH, 'utf-8'));
    this.version = staticZones.version;
    this.timeZones = staticZones.zones;

    return this.timeZones;
  }

  async getTimeZones() {
    const pgZones = await this.dbService.$queryRawUnsafe<PgZone[]>(
      'select name as id, utc_offset::text from pg_timezone_names',
    );

    const ianaZones = await this.loadIanaZones();

    const zones = pgZones.filter((tz) => ianaZones.includes(tz.id));

    let _zones = zones.map(this.parsePgZone);
    _zones = _zones.sort((a, b) => b.utcOffset - a.utcOffset);

    return _zones;
  }

  async getTimeZone(id: string) {
    const ianaZones = await this.loadIanaZones();

    if (!ianaZones.includes(id)) {
      return null;
    }

    const [pgZone] = await this.dbService.$queryRawUnsafe<PgZone[]>(
      `select name as id, utc_offset::text from pg_timezone_names where id = '${id}'`,
    );

    return this.parsePgZone(pgZone);
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
