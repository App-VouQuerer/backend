import knex from '~/database'
import bcrypt from 'bcryptjs'

class UserController {
  async create(req, res, next) {
    try {
      const { name, email, password } = req.body

      const hashPassword = await bcrypt.hash(password, 12)

      const [id] = await knex('users')
        .insert({
          name,
          email,
          password: hashPassword,
        })
        .returning('id')

      const [user] = await knex('users')
        .select('id', 'name', 'email', 'avatarUrl', 'phoneNumber')
        .where('id', id)

      return res.status(201).json({ user })
    } catch (error) {
      if (error.code === '23505') {
        next({
          message: 'O email que você enviou já está em uso.',
          status: 409,
          timestamp: new Date(),
        })
      }
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
