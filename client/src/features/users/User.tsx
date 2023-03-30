import React, { memo } from 'react'
import { EntityId } from '@reduxjs/toolkit'
import { useGetUsersQuery } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

type PropsType = {
  userId: EntityId
}

const User = ({ userId }: PropsType) => {
  const { user } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId]
    })
  })

  const navigate = useNavigate()

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`)

    const userRolesString: string = user.roles.toString().replaceAll(',', ', ')

    const cellStatus: string = user.active ? '' : 'table__cell--inactive'

    return (
      <tr className="table__row user">
        <td className={`table__cell ${cellStatus}`}>{user.username}</td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else {
    return <></>
  }
}

const memorizedUser = memo(User)

export default memorizedUser
