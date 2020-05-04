import { Router } from 'express'
import UserController from './controllers/UserController'

const routes = Router()

// routes.get('/api/v1/users/:id', UserController.find)
routes.get('/api/v1/users', UserController.index)
routes.post('/api/v1/users', UserController.create)
// routes.put('/api/v1/users/:id', UserController.update)
// routes.delete('/api/v1/users/:id', UserController.delete)

export default routes
