import React from 'react'
import { useAppSelector } from '~/hooks/useRedux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

const NewNote = () => {
  const users = useAppSelector(selectAllUsers)

  const content: JSX.Element = users ? <NewNoteForm users={users} /> : <p>Loading...</p>

  return content
}

export default NewNote
