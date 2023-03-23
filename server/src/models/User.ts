import mongoose, { Document, Schema } from 'mongoose'

export interface UserType extends Document {
  username: string
  password: string
  roles: string[]
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

const User = mongoose.model('User', userScheme)
export default User
