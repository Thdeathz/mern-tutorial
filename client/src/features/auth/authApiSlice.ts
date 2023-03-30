import { apiSlice } from '~/app/api/apiSlice'
import { logOut, setCrednetials } from './authSlice'

type CredentialType = {
  username: string
  password: string
}

export const authApiSilce = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: (credentials: CredentialType) => ({
        url: '/auth',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log('===> Data', data)

          dispatch(logOut([]))
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState())
          }, 1000)
        } catch (err) {
          console.error(err)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log('===> Data', data)
          const { accessToken } = data
          dispatch(setCrednetials({ accessToken }))
        } catch (error) {
          console.error(error)
        }
      }
    })
  })
})

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSilce
