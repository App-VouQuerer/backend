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

// catch all
app.use((error, req, res) => {
  res.status(error.status || 500)
  res.json({ error: error.message })
})

export default app
