import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect(<string>process.env.DATABASE_URI)
  } catch (error: any) {
    console.error(error.message)
  }
}
