import mongoose, { Document, Schema, Types } from 'mongoose'
import AutoIncrement from 'mongoose-sequence'

export interface NoteType extends Document {
  user: Types.ObjectId
  title: string
  text: string
  completed: boolean
}

const noteScheme: Schema<NoteType> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

noteScheme.plugin(AutoIncrement, { inc_field: 'ticket', id: 'ticketNums', start_seq: 500 })

const Note = mongoose.model('Note', noteScheme)
export default Note
