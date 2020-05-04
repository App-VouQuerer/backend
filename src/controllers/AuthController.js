import knex from '~/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body

      const [user] = await knex('users')
        .select('id', 'email', 'password')
        .where('email', email)
      if (!user) {
        const error = {
          message: 'Email ou senha informados estão incorretos.',
          status: 400,
          timestamp: new Date(),
        }
        throw error
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        const error = {
          message: 'Email ou senha informados estão incorretos.',
          status: 400,
          timestamp: new Date(),
        }
        throw error
      }

      const token = await jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      )
      res.json({ token: `Bearer ${token}` })
    } catch (error) {
      next(error)
    }
  }

  async me(req, res) {
    const user = req.user
    res.json({ user })
  }
}

export default new AuthController()
