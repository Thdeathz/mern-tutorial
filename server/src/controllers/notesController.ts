import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import { NoteData } from '~/@types'
import Note from '~/models/Note'
import User from '~/models/User'

/**
 * @desc Get all notes
 * @route GET /notes
 * @access Private
 */
export const getAllNotes: RequestHandler = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean()

  if (!notes?.length) {
    res.status(400).json({ message: 'Notes list empty.' })
    return
  }

  // Add username to each note before sending the response
  const notesWithUser = await Promise.all(
    notes.map(async note => {
      const user = await User.findById(note.user).select('username').lean().exec()
      return { ...note, username: user?.username }
    })
  )

  res.json(notesWithUser)
})

/**
 * @desc Create new note
 * @route POST /notes
 * @access Private
 */
export const createNewNote: RequestHandler = asyncHandler(async (req, res) => {
  const { user, title, text } = <NoteData>req.body

  // Confirm data
  if (!user || !title || !text) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  // Check if note already existed
  const duplicate = await Note.findOne({ title }).lean().exec()
  if (duplicate) {
    res.status(409).json({ message: 'Note already existed' })
    return
  }

  // Create new note
  const note = await Note.create({ user, title, text })
  if (note) res.status(201).json({ message: 'Note created successfully' })
  else res.status(400).json({ message: 'Invaild note data received' })
})

/**
 * @desc Update a note
 * @route PATCH /notes
 * @access Private
 */
export const updateNote: RequestHandler = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = <NoteData>req.body

  // Confirm data
  if (!id || !title || !text || completed === undefined) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  const note = await Note.findById(id).lean().exec()
  if (!note) {
    res.status(404).json({ message: 'Note not found' })
    return
  }

  // Check if note already existed
  const duplicate = await Note.findOne({ title }).lean().exec()
  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: 'Note already existed' })
    return
  }

  // Update note
  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  await Note.updateOne({ _id: note._id }, note).exec()

  res.json({ message: `Updated note ${note._id}.` })
})

/**
 * @desc Delete new note
 * @route DELETE /notes
 * @access Private
 */
export const deleteNote: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = <NoteData>req.body

  // Confirm data
  if (!id) {
    res.status(400).json({ message: 'Note ID Required' })
    return
  }

  const note = await Note.findById(id).lean().exec()
  if (!note) {
    res.status(400).json({ message: 'Note not found' })
    return
  }

  await Note.deleteOne({ _id: note._id }).exec()

  res.json({ message: `Deleted note ${note._id}.` })
})
