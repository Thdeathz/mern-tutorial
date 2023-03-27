import React from 'react'
import { EntityId } from '@reduxjs/toolkit'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '~/hooks/useRedux'
import { selectAllUsers } from '../users/usersApiSlice'
import EditNoteForm from './EditNoteForm'
import { selectNoteById } from './notesApiSlice'

const EditNote = () => {
  const { id } = useParams()

  const note = useAppSelector(state => selectNoteById(state, id as EntityId))
  const users = useAppSelector(selectAllUsers)

  const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

  return content
}

export default EditNote
