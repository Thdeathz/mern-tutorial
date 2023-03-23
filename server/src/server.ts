import express from 'express'
import path from 'path'
import rootRoutes from '~/routes/root'
import notFoundRoutes from '~/routes/404'

const app = express()
const PORT: string | 3500 = process.env.PORT || 3500

app.use('/', express.static(path.join(__dirname, '../public')))

/* ROUTES */
app.use('/', rootRoutes)

app.all('*', notFoundRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
