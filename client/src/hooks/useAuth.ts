import jwtDecode from 'jwt-decode'
import { ROLE } from '~/config/roles'
import { selectCurrentToken } from '~/features/auth/authSlice'
import { useAppSelector } from './useRedux'

type JwtPayload = {
  UserInfo: {
    username: string
    roles: ROLE[]
  }
}

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken)
  let isManager = false
  let isAdmin = false
  let status = 'Employee'

  if (token) {
    const decoded = jwtDecode(token) as JwtPayload
    const { username, roles } = decoded.UserInfo

    isManager = roles.includes('Manager')
    isAdmin = roles.includes('Admin')

    if (isManager) status = 'Manager'
    if (isAdmin) status = 'Admin'

    return { username, roles, isManager, isAdmin, status }
  }

  return { username: '', roles: [], isManager, isAdmin, status }
}

export default useAuth
