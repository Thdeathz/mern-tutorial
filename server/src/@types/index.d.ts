import { Types } from 'mongoose'

export declare interface UserData {
  id?: Types.ObjectId
  username: string
  password?: string
  roles: string[]
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
