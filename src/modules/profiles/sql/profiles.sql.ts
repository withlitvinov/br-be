import { sqlUtils } from '@/common/utils';

const simple = () => {
  const qb = sqlUtils.getQueryBuilder();

  return qb
    .select(['id', 'name', 'birthday', 'birthday_marker as birthdayMarker'])
    .from('person_profiles')
    .toQuery();
};

type UpcomingOptions = {
  tz: string;
};

const upcoming = (options: UpcomingOptions) => {
  const { tz } = options;

  const qb = sqlUtils.getQueryBuilder();

  const currentDateWithTz = `current_timestamp at time zone '${tz}'`;

  return qb
    .with('profiles_with_upcoming_birthday', (_qb) => {
      _qb
        .select([
          '*',
          // Constructs a date based on the current year. If the profile's birthday has already occurred this year,
          // the date will be set to the next year.
          qb.raw(
            `CASE WHEN EXTRACT(MONTH FROM birthday) > EXTRACT(MONTH FROM ${currentDateWithTz}) OR (EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM ${currentDateWithTz}) AND EXTRACT(DAY FROM birthday) >= EXTRACT(DAY FROM ${currentDateWithTz})) THEN MAKE_DATE(EXTRACT(YEAR FROM ${currentDateWithTz})::int, EXTRACT(MONTH FROM birthday)::int, EXTRACT(DAY FROM birthday)::int) ELSE MAKE_DATE(EXTRACT(YEAR FROM ${currentDateWithTz})::int + 1, EXTRACT(MONTH FROM birthday)::int, EXTRACT(DAY FROM birthday)::int) END as upcoming_birthday`,
          ),
        ])
        .from('person_profiles');
    })
    .select(['id', 'name', 'birthday', 'birthday_marker as birthdayMarker'])
    .from('profiles_with_upcoming_birthday')
    .orderBy('upcoming_birthday', 'asc')
    .toQuery();
};

export { simple, upcoming };
