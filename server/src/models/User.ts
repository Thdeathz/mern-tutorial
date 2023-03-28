import mongoose, { Document, Model, Schema } from 'mongoose'

export type ROLE = ['Admin' | 'Employee' | 'Manager']

export interface UserType extends Document {
  username: string
  password: string
  roles: ROLE[]
  active: boolean
}

const userScheme: Schema<UserType> = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [
    {
      type: String,
      default: 'Employee'
    }
  ],
  active: {
    type: Boolean,
    default: true
  }
})

const User: Model<UserType> = mongoose.model<UserType>('User', userScheme)
export default User
