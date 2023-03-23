import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { NextFunction, Request, Response } from 'express'

type logEventsType = (message: string, logFileName: string) => void

const fsPromises = fs.promises

export const logEvents: logEventsType = async (message, logFileName) => {
  const dateTime: string = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')
  const logItem: string = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '../../logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '../../logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, `../../logs/${logFileName}`), logItem)
  } catch (error) {
    console.error(error)
  }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'requests.log')
  console.log(`${req.method} ${req.path}`)
  next()
}
