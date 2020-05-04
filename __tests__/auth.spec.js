import app from '~/app'
import knex from '~/database'
import request from 'supertest'
import jwt from 'jsonwebtoken'

describe('Authentication endpoints', () => {
  afterAll(async () => {
    // await new Promise((resolve) => setTimeout(() => resolve(), 500)) // avoid jest open handle error
    await knex.destroy()
  })

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate and return jwt if valid credentials', () => {
      return request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'auth@email.com',
          password: '123456',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('token')
          const { token } = response.body
          expect(token).toBeTruthy()
          expect(token.split(' ')[0]).toEqual('Bearer')
        })
    })

    it('should return error and bad request if credentials are invalid', () => {
      return request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid@email.com',
          password: 'wrong_password',
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })
  })

  describe('GET /api/v1/auth/me', () => {
    let jwtToken

    beforeEach(async () => {
      const payload = { email: 'test@email.com' }
      jwtToken = await jwt.sign(payload, process.env.JWT_SECRET || 'secret')
    })

    it('should return error if authorization header is not sent', () => {
      return request(app)
        .get('/api/v1/auth/me')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })

    it('should return error if bearer token is invalid', () => {
      return request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'invalidtoken')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })

    it('should return user data if token is valid and not expired', () => {
      return request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('user')
        })
    })
  })
})
