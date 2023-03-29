import { apiSlice } from '~/app/api/apiSlice'
import { logOut } from './authSlice'

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
          dispatch(apiSlice.util.resetApiState())
        } catch (err) {
          console.error(err)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET'
      })
    })
  })
})

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } = authApiSilce
