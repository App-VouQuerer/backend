exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { name: 'Test User', email: 'test@email.com', password: '123456' },
      ])
    })
}
