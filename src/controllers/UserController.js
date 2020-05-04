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
      // Erro do PostgreSQL para unique constraint fail
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

  async update(req, res, next) {
    try {
      const id = req.params.id
      const { name, email } = req.body

      const [returnId] = await knex('users')
        .update({ name, email })
        .where('id', id)
        .returning('id')

      if (!returnId) {
        const error = {
          message: 'Um usuário com este ID não foi encontrado.',
          status: 404,
          timestamp: new Date(),
        }
        throw error
      }

      const [user] = await knex('users')
        .select('id', 'name', 'email', 'avatarUrl', 'phoneNumber')
        .where('id', id)

      return res.status(200).json({ user })
    } catch (error) {
      // Erro do PostgreSQL para UUID no formato inválido
      if (error.code === '22P02') {
        next({
          message: 'Este ID é inválido.',
          status: 400,
          timestamp: new Date(),
        })
      }
      next(error)
    }
  }

  // async find(req, res) {}

  // async delete(req, res) {}
}

export default new UserController()
