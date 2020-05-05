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

  async index(req, res, next) {
    const { page = 1, limit = 10, order, orderBy, name, email } = req.query

    try {
      const query = knex('users')
        .select('id', 'name', 'email', 'avatarUrl', 'phoneNumber')
        .limit(limit)
        .offset((page - 1) * limit)

      if (order && orderBy) {
        query.orderBy(orderBy, order)
      }

      const countQuery = knex('users').count()

      if (name) {
        query.where('name', 'ilike', `%${name}%`)
        countQuery.where('name', 'ilike', `%${name}%`)
      }

      if (email) {
        query.where('email', 'ilike', `%${email}%`)
        countQuery.where('email', 'ilike', `%${email}%`)
      }

      const [count] = await countQuery
      res.header('x-total-count', count['count'])

      const results = await query
      res.json({
        page: Number(page),
        limit: Number(limit),
        data: results,
      })
    } catch (error) {
      next(error)
    }
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

  async find(req, res, next) {
    try {
      const id = req.params.id

      const [user] = await knex('users')
        .select('id', 'name', 'email', 'avatarUrl', 'phoneNumber')
        .where('id', id)

      if (!user) {
        const error = {
          message: 'Um usuário com este ID não foi encontrado.',
          status: 404,
          timestamp: new Date(),
        }
        throw error
      }

      return res.status(200).json({ user })
    } catch (error) {
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

  // async delete(req, res) {}
}

export default new UserController()
