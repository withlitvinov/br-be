import * as fs from 'node:fs/promises';

/*
You need to update tzdata.zi file's content when the IANA database updates and regenerates zones.json
This is required to have an up-to-date zone list

You can find the latest of the IANA database here https://www.iana.org/time-zones
 */

const TZZI_FILE_PATH = './tools/tzdata.zi';
const DESTINATION_FILE_PATH = './src/static/zones.json';

const extractZones = (lines: string[]) => {
  const zoneDefinitions = lines.filter((def) => def.startsWith('Z'));

  const zones: string[] = [];

  for (const line of zoneDefinitions) {
    const [, zone] = line.split(' ');

    zones.push(zone);
  }

  return zones;
};

const extractAliases = (lines: string[]) => {
  const aliasDefinitions = lines.filter((def) => def.startsWith('L'));

  const aliases: {
    [zone: string]: string[];
  } = {};

  for (const line of aliasDefinitions) {
    const [, zone, alias] = line.split(' ');

    if (!aliases[zone]) {
      aliases[zone] = [alias];
    } else {
      aliases[zone].push(alias);
    }
  }

  return aliases;
};

const mergeZoneWithAliases = (
  zones: string[],
  aliases: { [zone: string]: string[] },
) => {
  return zones.map((tz) => ({
    id: tz,
    aliases: aliases[tz] ?? null,
  }));
};

const main = async () => {
  const tzdata = await fs.readFile(TZZI_FILE_PATH, 'utf-8');

  const _tzdata = tzdata.split('\n');

  const [, , version] = _tzdata[0].split(' ');

  const zones = extractZones(_tzdata);
  const aliases = extractAliases(_tzdata);

  await fs.writeFile(
    DESTINATION_FILE_PATH,
    JSON.stringify({
      version,
      zones: mergeZoneWithAliases(zones, aliases),
    }),
    'utf-8',
  );
};

main();
