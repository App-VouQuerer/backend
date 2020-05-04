import app from '~/app'
import request from 'supertest'

describe('User endpoints', () => {
  afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)) // avoid jest open handle error
  })

  describe('POST /api/v1/user', () => {
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
        .then((response) => {
          console.log(response.body)
        })
    })
  })
})
