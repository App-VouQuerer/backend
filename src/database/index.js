import { config } from 'dotenv';
import knex from 'knex';

config();

const client = knex({
  client: 'pg',
  connection: process.env.NODE_ENV !== 'production' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL,
});

export default client;
