import Knex from 'knex';

const getQueryBuilder = () => {
  return Knex({ client: 'pg' });
};

const noOrder = () => {
  const qb = getQueryBuilder();

  return qb
    .select(['id', 'name', 'birthday', 'birthday_marker as birthdayMarker'])
    .from('person_profiles')
    .toQuery();
};

type UpcomingOptions = {
  tz: string;
};

const upcomingBirthdayOrder = (options: UpcomingOptions) => {
  const { tz } = options;

  const qb = getQueryBuilder();

  const currentDateWithTz = `current_date at time zone '${tz}'`;

  const query = qb
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
    .orderBy('upcoming_birthday', 'asc');

  return query.toQuery();
};

export { noOrder, upcomingBirthdayOrder };
