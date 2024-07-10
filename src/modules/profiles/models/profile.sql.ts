import { sql } from '@/common';

const noOrder = () => {
  return sql.select(
    ['id', 'name', 'birthday', sql.as('birthday_marker', 'birthdayMarker')],
    'person_profiles',
  );
};

const upcomingBirthdayOrder = () => {
  const upcomingBirthday = sql.as(
    sql.$case(
      [
        sql.whenthen(
          sql.or([
            'extract(month from birthday) > extract(month from current_date)',
            sql.and([
              'extract(month from birthday) = extract(month from current_date)',
              'extract(day from birthday) >= extract(day from current_date)',
            ]),
          ]),
          sql.makeDate(
            'extract(year from current_date)::int',
            'extract(month from birthday)::int',
            'extract(day from birthday)::int',
          ),
        ),
      ],
      sql.makeDate(
        'extract(year from current_date)::int + 1',
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
