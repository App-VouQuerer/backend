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

  describe('GET /api/v1/users/:id', () => {
    let userFound

    beforeEach(async () => {
      let [result] = await knex('users')
        .select('id', 'name', 'email')
        .where('email', 'test@email.com')
      userFound = result
    })

    it('should return an user if correct id is passed', () => {
      return request(app)
        .get(`/api/v1/users/${userFound.id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('user')
          const { user } = response.body
          expect(user.id).toEqual(userFound.id)
          expect(user.email).toEqual(userFound.email)
          expect(user.name).toEqual(userFound.name)
        })
    })

    it('should return error and status 400 if invalid id is passed', () => {
      return request(app)
        .get(`/api/v1/users/invalidid`)
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })

    it('should return error and status 404 if id is valid but non existent', () => {
      return request(app)
        .get(`/api/v1/users/${'84934398-09f0-4447-86dc-b4ebd7a0cf76'}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toHaveProperty('message')
        })
    })
  })

  describe('GET /api/v1/users', () => {
    it('should return paginated list of users', () => {
      return request(app)
        .get(`/api/v1/users`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('page')
          expect(response.body).toHaveProperty('limit')
          expect(response.body).toHaveProperty('data')
          expect(response.headers).toHaveProperty('x-total-count')
          const { page, limit, data } = response.body
          expect(page).toBe(1)
          expect(limit).toBe(10)
          expect(Array.isArray(data)).toBe(true)
          expect(data[0].password).toBeFalsy() // Não deve enviar senhas de usuários
        })
    })

    it('should return paginated list with page and limit options', () => {
      return request(app)
        .get(`/api/v1/users?page=1&limit=2`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('page')
          expect(response.body).toHaveProperty('limit')
          expect(response.body).toHaveProperty('data')
          expect(response.headers).toHaveProperty('x-total-count')
          const { page, limit, data } = response.body
          expect(page).toBe(1)
          expect(limit).toBe(2)
          expect(Array.isArray(data)).toBe(true)
        })
    })

    it('should return paginated list with email query', () => {
      return request(app)
        .get(`/api/v1/users?email=test`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('page')
          expect(response.body).toHaveProperty('limit')
          expect(response.body).toHaveProperty('data')
          expect(response.headers).toHaveProperty('x-total-count')
          const { page, limit, data } = response.body
          expect(page).toBe(1)
          expect(limit).toBe(10)
          expect(Array.isArray(data)).toBe(true)
          expect(data.length).toBeGreaterThan(0)
        })
    })

    it('should return paginated list with name query', () => {
      return request(app)
        .get(`/api/v1/users?name=test`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('page')
          expect(response.body).toHaveProperty('limit')
          expect(response.body).toHaveProperty('data')
          expect(response.headers).toHaveProperty('x-total-count')
          const { page, limit, data } = response.body
          expect(page).toBe(1)
          expect(limit).toBe(10)
          expect(Array.isArray(data)).toBe(true)
          expect(data.length).toBeGreaterThan(0)
        })
    })

    it('should return paginated list with name and email query', () => {
      return request(app)
        .get(`/api/v1/users?name=test&email=test`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('page')
          expect(response.body).toHaveProperty('limit')
          expect(response.body).toHaveProperty('data')
          expect(response.headers).toHaveProperty('x-total-count')
          const { page, limit, data } = response.body
          expect(page).toBe(1)
          expect(limit).toBe(10)
          expect(Array.isArray(data)).toBe(true)
          expect(data.length).toBeGreaterThan(0)
        })
    })

    it('should return paginated list with order', () => {
      return request(app)
        .get(`/api/v1/users?page=1&limit=20&order=asc&orderBy=name`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('page')
          expect(response.body).toHaveProperty('limit')
          expect(response.body).toHaveProperty('data')
          expect(response.headers).toHaveProperty('x-total-count')
          const { page, limit, data } = response.body
          expect(page).toBe(1)
          expect(limit).toBe(20)
          expect(Array.isArray(data)).toBe(true)
          expect(data.length).toBeGreaterThan(0)
        })
    })
  })
})
