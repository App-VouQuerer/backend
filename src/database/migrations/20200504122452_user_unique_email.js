exports.up = async function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.unique('email')
  })
}

exports.down = async function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropUnique('email')
  })
}
