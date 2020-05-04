import knex from '~/database'
import app from '~/app'
import request from 'supertest'

describe('User endpoints', () => {
  afterAll(async () => {
    await knex('users').delete().where('email', 'djfrizer1@gmail.com') // Apagar usuário para evitar erro de email único no teste
    // await new Promise((resolve) => setTimeout(() => resolve(), 500)) // avoid jest open handle error
    await knex.destroy()
  })

  describe('POST /api/v1/users', () => {
    it('should create an user with valid data', () => {
      return request(app)
        .post('/api/v1/users')
        .send({
          name: 'Bruno Lombardi',
          email: 'djfrizer1@gmail.com',
          password: '123456',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          const { user } = response.body
          expect(user.id).toBeTruthy()
          expect(user.name).toEqual('Bruno Lombardi')
          expect(user.email).toEqual('djfrizer1@gmail.com')
          expect(user.password).toBeFalsy()
        })
    })

    it('should not create an user with existing email', () => {
      return request(app)
        .post('/api/v1/users')
        .send({
          name: 'Test User',
          email: 'test@email.com',
          password: '123456',
        })
        .expect('Content-Type', /json/)
        .expect(409)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })
  })

  describe('PUT /api/v1/users/:id', () => {
    let userId

    beforeEach(async () => {
      let [result] = await knex('users')
        .select('id')
        .where('email', 'djfrizer1@gmail.com')
      userId = result.id
    })

    afterEach(async () => {
      await knex('users')
        .update({ email: 'djfrizer1@gmail.com' })
        .where('email', 'walleksmiranda@gmail.com')
    })

    it('should update user data if valid id is passed', () => {
      return request(app)
        .put(`/api/v1/users/${userId}`)
        .send({
          name: 'Walleks Miranda',
          email: 'walleksmiranda@gmail.com',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const { user } = response.body
          expect(user.id).toEqual(userId)
          expect(user.email).toEqual('walleksmiranda@gmail.com')
          expect(user.name).toEqual('Walleks Miranda')
          expect(user).not.toHaveProperty('password')
        })
    })

    it('should return error and status 404 if valid non existent id is passed', () => {
      return request(app)
        .put(`/api/v1/users/${'84934398-09f0-4447-86dc-b4ebd7a0cf76'}`)
        .send({
          name: 'Walleks Miranda',
          email: 'walleksmiranda@gmail.com',
        })
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })

    it('should return error and status 400 if invalid id is passed', () => {
      return request(app)
        .put(`/api/v1/users/invalidid`)
        .send({
          name: 'Walleks Miranda',
          email: 'walleksmiranda@gmail.com',
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })
  })
})
