import React from 'react'
import User from './User'
import { useGetUsersQuery } from './usersApiSlice'

const UsersList = () => {
  const { data: users, isLoading, isSuccess, isError } = useGetUsersQuery([])

  let content: JSX.Element = <></>

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className={'errmsg'}>Fetching error</p>
  }

  if (isSuccess) {
    const { ids } = users

    const tableContent: JSX.Element | JSX.Element[] = ids?.length ? (
      ids.map(userId => <User key={userId} userId={userId} />)
    ) : (
      <></>
    )

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    )
  }

  return content
}

export default UsersList
