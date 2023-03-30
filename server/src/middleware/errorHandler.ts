import { ErrorRequestHandler } from 'express'
import { logEvents } from './logger'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errors.log'
  )
  console.log(err.stack)

  const status: number = res.statusCode ? res.statusCode : 500

  res.status(status)

  res.json({
    message: err.message,
    isError: true
  })
}
