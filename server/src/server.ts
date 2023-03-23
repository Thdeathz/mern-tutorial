import express from 'express'
import cors from 'cors'
import path from 'path'
import rootRoutes from '~/routes/root'
import notFoundRoutes from '~/routes/404'
import { logger } from './middleware/logger'
import { errorHandler } from './middleware/errorHandler'
import cookieParser from 'cookie-parser'
import { corsOptions } from './config/corsOptions'

const app = express()
const PORT: string | 3500 = process.env.PORT || 3500

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
