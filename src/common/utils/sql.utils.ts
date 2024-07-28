import Knex from 'knex';

const getQueryBuilder = () => {
  return Knex({
    client: 'pg',
  });
};

export { getQueryBuilder };
