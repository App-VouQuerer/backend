import knex from '../database'

class UserController {
  async create(req, res, next) {
    try {
      const { name, email, password } = req.body

      const [id] = await knex('users')
        .insert({
          name,
          email,
          password,
        })
        .returning('id')

      const [user] = await knex('users')
        .select('id', 'name', 'email', 'avatarUrl', 'phoneNumber')
        .where('id', id)

      return res.status(201).json({ user })
    } catch (error) {
      next(error)
    }
  }

  async index(req, res) {
    const users = await knex('users')

    res.json({
      users,
    })
  }

  // async update(req, res) {}

  // async find(req, res) {}

  // async delete(req, res) {}
}

export default new UserController()
