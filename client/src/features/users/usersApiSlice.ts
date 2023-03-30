import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '~/app/api/apiSlice'
import { RootState } from '~/app/store'
import { ROLE } from '~/config/roles'

export interface User {
  id: string
  username: string
  roles: ROLE[]
  active: boolean
}

const usersApdapter = createEntityAdapter<User>({})

const initialState = usersApdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        validateStatus: (response: Response, result: any) =>
          response.status === 200 && !result.isError
      }),
      transformResponse: (responseData: (User & { _id: string })[]) => {
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
    }),
    addNewUser: builder.mutation({
      query: (initialUserData: Omit<User, 'id' | 'active'> & { password: string }) => ({
        url: '/users',
        method: 'POST',
        body: {
          ...initialUserData
        }
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    }),
    updateUser: builder.mutation({
      query: (initialUserData: User & { password?: string }) => ({
        url: '/users',
        method: 'PATCH',
        body: {
          ...initialUserData
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
    }),
    deleteUser: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/users',
        method: 'DELETE',
        body: {
          id
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
    })
  })
})

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApiSlice

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
