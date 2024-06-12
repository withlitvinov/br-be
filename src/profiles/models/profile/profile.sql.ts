import { Prisma } from '@prisma/client';

export const getManyInUpcomingBirthdayOrderSql = () => {
  return Prisma.sql`WITH
  modified_person_profiles AS (
    SELECT
      *,
      (
        CASE
          WHEN (
            EXTRACT(
              MONTH
              FROM
                birthday
            ) > EXTRACT(
              MONTH
              FROM
                CURRENT_DATE
            )
          )
          OR (
            EXTRACT(
              MONTH
              FROM
                birthday
            ) = EXTRACT(
              MONTH
              FROM
                CURRENT_DATE
            )
            AND EXTRACT(
              DAY
              FROM
                birthday
            ) >= EXTRACT(
              DAY
              FROM
                CURRENT_DATE
            )
          ) THEN MAKE_DATE(
            EXTRACT(
              YEAR
              FROM
                CURRENT_DATE
            )::INT,
            EXTRACT(
              MONTH
              FROM
                birthday
            )::INT,
            EXTRACT(
              DAY
              FROM
                birthday
            )::INT
          )
          ELSE MAKE_DATE(
            EXTRACT(
              YEAR
              FROM
                CURRENT_DATE
            )::INT + 1,
            EXTRACT(
              MONTH
              FROM
                birthday
            )::INT,
            EXTRACT(
              DAY
              FROM
                birthday
            )::INT
          )
        END
      ) AS upcoming_birthday
    FROM
      person_profiles
  )
SELECT
  id,
  name,
  birthday
FROM
  modified_person_profiles
ORDER BY
  upcoming_birthday ASC;`;
};
