import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '~/app/store'

type StateType = {
  token: string | null
}

const initialState: StateType = { token: null }

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCrednetials: (state, action) => {
      const { accessToken } = action.payload as { accessToken: string }
      state.token = accessToken
    },
    logOut: (state, action) => {
      state.token = null
    }
  }
})

export const { setCrednetials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: RootState) => state.auth.token
