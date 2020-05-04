import { config } from 'dotenv'
import knex from 'knex'

config()

const env = process.env.NODE_ENV
const url = () => {
  switch (env) {
    case 'production':
      return process.env.DATABASE_URL
    case 'test':
      return process.env.TEST_DATABASE_URL
    default:
      return process.env.DEV_DATABASE_URL
  }
}

const client = knex({
  client: 'pg',
  connection: url(),
})

export default client
