// Update with your config settings.
require('dotenv').config()

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.NODE_ENV !== 'production' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL,
  },

  staging: {
    client: 'pg',
    connection: process.env.NODE_ENV !== 'production' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.NODE_ENV !== 'production' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
