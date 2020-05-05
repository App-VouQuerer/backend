import { Router } from 'express'
import auth from '~/middlewares/auth'
import UserController from '~/controllers/UserController'
import AuthController from '~/controllers/AuthController'

const routes = Router()

routes.get('/api/v1/users/:id', UserController.find)
routes.get('/api/v1/users', UserController.index)
routes.post('/api/v1/users', UserController.create)
routes.put('/api/v1/users/:id', UserController.update)
// routes.delete('/api/v1/users/:id', UserController.delete)

routes.post('/api/v1/auth/login', AuthController.login)
routes.get('/api/v1/auth/me', auth, AuthController.me)

export default routes
