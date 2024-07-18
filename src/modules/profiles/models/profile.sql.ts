import { sql } from '@/common';

const noOrder = () => {
  return sql.select(
    ['id', 'name', 'birthday', sql.as('birthday_marker', 'birthdayMarker')],
    'person_profiles',
  );
};

const upcomingBirthdayOrder = () => {
  // TODO: Replace "'Europe/Kiev'" with user's timezone
  const currentDate = "current_date at time zone 'Europe/Kiev'";

  const upcomingBirthday = sql.as(
    sql.$case(
      [
        sql.whenthen(
          sql.or([
            `extract(month from birthday) > extract(month from ${currentDate})`,
            sql.and([
              `extract(month from birthday) = extract(month from ${currentDate})`,
              `extract(day from birthday) >= extract(day from ${currentDate})`,
            ]),
          ]),
          sql.makeDate(
            `extract(year from ${currentDate})::int`,
            'extract(month from birthday)::int',
            'extract(day from birthday)::int',
          ),
        ),
      ],
      sql.makeDate(
        `extract(year from ${currentDate})::int + 1`,
        'extract(month from birthday)::int',
        'extract(day from birthday)::int',
      ),
    ),
    'upcoming_birthday',
  );

  return sql.join([
    sql.cte(
      'profiles_with_upcoming_birthday',
      sql.select(['*', upcomingBirthday], 'person_profiles'),
    ),
    sql.select(
      ['id', 'name', 'birthday', sql.as('birthday_marker', 'birthdayMarker')],
      'profiles_with_upcoming_birthday',
    ),
    sql.order(sql.ocondition('upcoming_birthday', sql.OrderOperatorEnum.Asc)),
  ]);
};

export { noOrder, upcomingBirthdayOrder };
