import { rateLimit } from 'express-rate-limit'
import { logEvents } from './logger'

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests pre `window` per minute
  message: {
    message: 'Too many login attempts from this IP, please try again after 1 minute pause'
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}`,
      'errLog.log'
    )
    res.status(options.statusCode).send(options.message)
  }
})

export default loginLimiter
