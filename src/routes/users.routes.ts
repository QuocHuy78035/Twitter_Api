import { Router } from 'express'
import {
  changePasswordController,
  followController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  unFollowUserController,
  updateMeController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  ChangePasswordValidator,
  followUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  UnFollowUserValidator,
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
 - Description: Refresh token
 - Path: /refresh-token
 - Method: Post
 - Body: {refresh_token: string}
*/
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

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
 - Method: Post
 - Header: {Authorization: Bearer <access_token>}
 - Body: {'followed_user_id' : string}
*/
userRouter.post('/follow', accessTokenValidator, followUserValidator, wrapRequestHandler(followController))

/*
 - Description: unfollow someone
 - Path: /follow/:followed_user_id
 - Method: Delete
 - Header: {Authorization: Bearer <access_token>}
*/
userRouter.delete(
  '/follow/:followed_user_id',
  accessTokenValidator,
  UnFollowUserValidator,
  wrapRequestHandler(unFollowUserController)
)

/*
 - Description: change password
 - Path: /user/password
 - Method: Put
 - Header: {Authorization: Bearer <access_token>}
 - Body: {'old_password' : string, 'new_password': string, 'new_password_confirm' : string}
*/
userRouter.put('/password', accessTokenValidator, ChangePasswordValidator, wrapRequestHandler(changePasswordController))

export default userRouter
