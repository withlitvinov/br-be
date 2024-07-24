import * as fs from 'node:fs/promises';

/*
You need to update tzdata.zi file's content when the IANA database updates and regenerates zones.json
This is required to have an up-to-date zone list

You can find the latest of the IANA database here https://www.iana.org/time-zones
 */

const TZZI_FILE_PATH = './tools/tzdata.zi';
const DESTINATION_FILE_PATH = './src/static/zones.json';

const main = async () => {
  const tzdata = await fs.readFile(TZZI_FILE_PATH, 'utf-8');

  let _tzdata = tzdata.split('\n');

  const [, , version] = _tzdata[0].split(' ');

  // Get all lines with time zone definition
  _tzdata = _tzdata.filter((line) => line.startsWith('Z'));

  const zones: string[] = [];

  for (const line of _tzdata) {
    const [, zone] = line.split(' ');

    zones.push(zone);
  }

  await fs.writeFile(
    DESTINATION_FILE_PATH,
    JSON.stringify({
      version,
      zones,
    }),
    'utf-8',
  );
};

main();
