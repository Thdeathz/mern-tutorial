import express from 'express'
import { createNewUser, deleteUser, getAllUsers, updateUser } from '~/controllers/usersController'
import verifyJWT from '~/middleware/verifyJWT'

const router = express.Router()

router.use(verifyJWT)

router.route('/').get(getAllUsers).post(createNewUser).patch(updateUser).delete(deleteUser)

export default router
