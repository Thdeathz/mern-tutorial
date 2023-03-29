import React from 'react'
import { useAppSelector } from '~/hooks/useRedux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

const NewNote = () => {
  const users = useAppSelector(selectAllUsers)

  if (!users?.length) return <p>Not Current Available</p>

  const content: JSX.Element = <NewNoteForm users={users} />

  return content
}

export default NewNote
