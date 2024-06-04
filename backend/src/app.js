import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth.routes.js'
import taskRouter from './routes/task.routes.js'
import cronoTaskRouter from './routes/cronoTask.routes.js'
import timerTaskRouter from './routes/timerTask.routes.js'


const app = express()

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true)
  },
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api/health', (req, res, next) => {
  res.status(200).json({ message: 'Status 200 OK' })
})

app.use('/api', authRouter)
app.use('/api', taskRouter)
app.use('/api', cronoTaskRouter)
app.use('/api', timerTaskRouter)

export default app