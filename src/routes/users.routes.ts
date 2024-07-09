import { Router } from 'express'
import {
  followController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  updateMeController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  updateMeValidator
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

/*
 - Description: get info user
 - Path: /me
 - Method: Get
 - Header: {Authorization: Bearer <access_token>}
*/
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/*
 - Description: update info user
 - Path: /me
 - Method: Patch
 - Header: {Authorization: Bearer <access_token>}
 - Body: UserSchema
*/
userRouter.patch('/me', accessTokenValidator, updateMeValidator, wrapRequestHandler(updateMeController))

/*
 - Description: get profile
 - Path: /:username
 - Method: Get
 - Header: {Authorization: Bearer <access_token>}
*/
userRouter.get('/:username', accessTokenValidator, wrapRequestHandler(getProfileController))

/*
 - Description: follow someone
 - Path: /follow
 - Method: post
 - Header: {Authorization: Bearer <access_token>}
 - Body: {'followed_user_id' : string}
*/
userRouter.post('/follow', accessTokenValidator, wrapRequestHandler(followController))

export default userRouter
