import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouter = Router()

/*
 - Description: Login user
 - Path: /login
 - Method: Post
 - Body: {email: string, password: string}
*/
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/*
 - Description: Register user
 - Path: /register
 - Method: Post
 - Body: {name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601}
*/
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/*
 - Description: Logout user
 - Path: /logout
 - Method: Post
 - Header: {Authorization: Bearer <access_token>}
 -Body: {refresh_token: string}
*/
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default userRouter
