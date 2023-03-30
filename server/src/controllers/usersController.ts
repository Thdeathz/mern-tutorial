import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import User from '~/models/User'
import bcrypt from 'bcrypt'
import { UserData } from '~/@types'
import Note from '~/models/Note'

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
export const getAllUsers: RequestHandler = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    res.status(400).json({ message: 'No users found' })
    return
  }

  res.json(users)
})

/**
 * @desc Create new user
 * @route POST /users
 * @access Private
 */
export const createNewUser: RequestHandler = asyncHandler(async (req, res) => {
  const { username, password, roles } = <UserData>req.body

  // Confirm data
  if (!username || !password) {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  // Check if user already existed
  const userExisted = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  if (userExisted) {
    res.status(409).json({ message: 'User already existed' })
    return
  }

  // Hash password
  const hashedPassword: string = await bcrypt.hash(<string>password, 10)
  const userObject: UserData =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPassword }
      : { username, password: hashedPassword, roles }

  // Create new user
  const user = await User.create(userObject)
  if (user) res.status(201).json({ message: 'User created successfully' })
  else res.status(400).json({ message: 'Invaild user data received' })
})

/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
 */
export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = <UserData>req.body

  // Confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    res.status(400).json({ message: 'Please provide all required fields' })
    return
  }

  const user = await User.findById(id).lean().exec()

  if (!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }

  // Check if user already existed
  const userExisted = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()
  // Allow updates to the original user
  if (userExisted && userExisted?._id.toString() !== id) {
    res.status(409).json({ message: 'Duplicate username' })
    return
  }

  user.username = username
  user.roles = roles
  user.active = active

  if (password) user.password = await bcrypt.hash(password, 10)

  await User.updateOne({ _id: user._id }, user).lean().exec()

  res.json({
    message: `Updated user ${username}.`
  })
})

/**
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
 */
export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = <UserData>req.body

  if (!id) {
    res.status(400).json({ message: 'User ID Required' })
    return
  }

  const note = await Note.findOne({ user: id }).lean().exec()
  if (note) {
    res.status(200).json({ message: 'User has assigned notes' })
    return
  }

  const user = await User.findById(id).lean().exec()

  if (!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }

  await User.deleteOne({ _id: user._id }).lean().exec()

  res.json({
    message: `Username ${user.username} with ID ${user._id} has been deleted.`
  })
})
