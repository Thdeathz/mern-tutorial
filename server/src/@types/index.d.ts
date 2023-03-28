import { Types } from 'mongoose'
import { ROLE } from '~/models/User'

export declare interface UserData {
  id?: Types.ObjectId
  username: string
  password?: string
  roles: ROLE[]
  active: boolean
}

export declare interface NoteData {
  id?: Types.ObjectId
  user: Types.ObjectId
  username?: string
  title: string
  text: string
  completed: boolean
}

declare global {
  namespace Express {
    interface Request {
      user: string
      roles: ROLE[]
    }
  }
}
