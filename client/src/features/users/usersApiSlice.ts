import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '~/app/api/apiSlice'
import { RootState } from '~/app/store'

export interface User {
  id: string
  username: string
  roles: string[]
  active: boolean
}

type ResponseData = User & { _id: string }

const usersApdapter = createEntityAdapter<User>({})

const initialState = usersApdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response, result) => response.status === 200 && !result.isError
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData: ResponseData[]) => {
        const loaderUsers: User[] = responseData.map(user => {
          user.id = user._id
          return user as User
        })

        return usersApdapter.setAll(initialState, loaderUsers)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'User' as const, id }))
          ]
        } else return [{ type: 'User', id: 'LIST' }]
      }
    })
  })
})

export const { useGetUsersQuery } = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select([])

const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data as NonNullable<typeof usersResult.data>
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersApdapter.getSelectors((state: RootState) => selectUsersData(state) ?? initialState)
