import express from 'express'
import routes from './routes'

const app = express()
app.use(express.json())

app.use(routes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(error.status || 500)
    return res.json({
      message: error.message || 'Erro interno no servidor.',
      status: error.status || 500,
      timestamp: error.timestamp || new Date(),
    })
  }
  res.status(error.status || 500)
  res.json(error)
})

export default app
