import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCrednetials } from '~/features/auth/authSlice'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  }
})

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log('==> refresh token')

    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    if (refreshResult?.data) {
      // store new token
      api.dispatch(setCrednetials({ ...refreshResult.data }))

      // retry original request
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        ;(refreshResult.error.data as any).message = 'Your login has expired. '
      }

      return refreshResult
    }
  }

  return result ?? { data: undefined, error: undefined }
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Note', 'User'],
  endpoints: builder => ({})
})
