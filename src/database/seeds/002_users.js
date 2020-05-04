const bcrypt = require('bcryptjs')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').then(async () => {
    const password = await bcrypt.hash('123456', 12)
    return knex('users').insert([
      { name: 'Auth User', email: 'auth@email.com', password },
    ])
  })
}
