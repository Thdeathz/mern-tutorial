import express, { Request, Response } from 'express'
import path from 'path'

const router = express.Router()

router.get('*', (req: Request, res: Response) => {
  res.status(404)

  if (req.accepts('html')) res.sendFile(path.join(__dirname, '../../views/404.html'))
  else if (req.accepts('json')) res.json({ message: '404 Not found' })
  else res.type('txt').send('404 Not found')
})

export default router