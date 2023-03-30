import React from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { useGetUsersQuery, User } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm'

const NewNote = () => {
  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    })
  })

  if (!users?.length) return <PulseLoader color="#FFF" />

  const content: JSX.Element = <NewNoteForm users={users as User[]} />

  return content
}

export default NewNote
