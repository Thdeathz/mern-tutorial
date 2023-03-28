import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import { UserData } from '~/@types'
import User, { ROLE } from '~/models/User'
import bcrypt from 'bcrypt'
import jwt, { VerifyOptions } from 'jsonwebtoken'

/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { username, password } = <UserData>req.body

  if (!username || !password) {
    res.status(400).json({ message: 'All required fields' })
    return
  }

  const foundUser = await User.findOne({ username }).lean().exec()
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const match: boolean = await bcrypt.compare(password, foundUser.password)

  if (!match) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const accessToken: string = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1m' }
  )

  const refreshToken: string = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  )

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https protocol required
    sameSite: 'none', // cross-site cookie
    maxAge: 1000 * 60 * 60 * 24 * 1 // match to refresh token expiration
  })

  res.json({ accessToken })
})

/**
 * @desc Refresh
 * @route GET /auth/refresh
 * @access Public
 */
export const refresh: RequestHandler = (req, res) => {
  const cookie = req.cookies

  if (!cookie?.jwt) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const refreshToken: string = cookie.jwt

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err, decoded) => {
    const userData = decoded as Pick<UserData, 'username' | 'roles'> | undefined

    if (err || !userData || !userData.username) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    const foundUser = await User.findOne({ username: userData.username }).lean().exec()
    if (!foundUser) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const accessToken: string = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1m' }
    )

    res.json({ accessToken })
  })
}

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public
 */
export const logout: RequestHandler = (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    res.status(204)
    return
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
  res.json({ message: 'Cookie cleared' })
}
