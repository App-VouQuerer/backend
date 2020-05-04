
exports.up = async function(knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');

  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(table) {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string('name', 160).notNullable();
        table.string('email', 255).notNullable();
        table.string('password', 64).notNullable();
        table.string('avatarUrl', 255).nullable();
        table.string('phoneNumber', 18).nullable();
      });
    }
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('users');
  return knex.raw('drop extension if exists "uuid-ossp"');
};
