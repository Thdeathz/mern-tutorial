import express from 'express'
import { createNewNote, deleteNote, getAllNotes, updateNote } from '~/controllers/notesController'
import verifyJWT from '~/middleware/verifyJWT'

const router = express.Router()

router.use(verifyJWT)

router.route('/').get(getAllNotes).post(createNewNote).patch(updateNote).delete(deleteNote)

export default router
