// Update with your config settings.
require('dotenv').config()

module.exports = {
  development: {
    client: 'pg',
    connection:
      process.env.NODE_ENV !== 'production'
        ? process.env.DEV_DATABASE_URL
        : process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/database/migrations',
    },
    seeds: {
      directory: 'src/database/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/database/migrations',
    },
    seeds: {
      directory: 'src/database/seeds',
    },
  },

  production: {
    client: 'pg',
    connection:
      process.env.NODE_ENV !== 'production'
        ? process.env.DEV_DATABASE_URL
        : process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/database/migrations',
    },
    seeds: {
      directory: 'src/database/seeds',
    },
  },
}
