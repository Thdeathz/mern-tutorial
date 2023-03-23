import dotenv from 'dotenv-safe'
import express from 'express'
import cors from 'cors'
import path from 'path'
import rootRoutes from '~/routes/root'
import notFoundRoutes from '~/routes/404'
import { logEvents, logger } from './middleware/logger'
import { errorHandler } from './middleware/errorHandler'
import cookieParser from 'cookie-parser'
import { corsOptions } from './config/corsOptions'
import { connectDB } from './config/dbConnect'
import mongoose from 'mongoose'

dotenv.config()
const app = express()
const PORT: string | 3500 = process.env.PORT || 3500

console.log(process.env.NODE_ENV)
connectDB()

/* MIDDLEWARE */
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '../public')))

/* ROUTES */
app.use('/', rootRoutes)
app.all('*', notFoundRoutes)

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!')

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
