import knex from '~/database'
import jwt from 'jsonwebtoken'

const invalidToken = (timestamp) => ({
  message: 'Token de autenticação inválido.',
  status: 400,
  timestamp,
})

const requiredToken = (timestamp) => ({
  message: 'Você não está autenticado.',
  status: 400,
  timestamp,
})

export default async (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    return next(requiredToken(new Date()))
  }

  if (!bearer.match(/^Bearer/)) {
    return next(requiredToken(new Date()))
  }

  const token = bearer.split(' ')[1]
  if (!token) {
    return next(invalidToken(new Date()))
  }

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET || 'secret')

    const [user] = await knex('users')
      .select('id', 'email', 'name', 'avatarUrl')
      .where('email', payload.email)

    if (!user) {
      const error = {
        message: 'Você não está autenticado.',
        status: 401,
        timestamp: new Date(),
      }
      throw error
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
