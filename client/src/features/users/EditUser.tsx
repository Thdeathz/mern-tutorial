import React from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '~/hooks/useRedux'
import { selectUserById } from './usersApiSlice'
import { EntityId } from '@reduxjs/toolkit'
import EditUserForm from './EditUserForm'

const EditUser = () => {
  const { id } = useParams()

  const user = useAppSelector(state => selectUserById(state, id as EntityId))

  const content: JSX.Element = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  return content
}

export default EditUser
