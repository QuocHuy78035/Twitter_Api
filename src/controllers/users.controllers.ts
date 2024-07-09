import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_MESSAGE } from '~/constants/message'
import {
  FollowRequestBody,
  RegisterRequestBody,
  TokenPayLoad,
  UnFollowRequestParams,
  UpdateMeRequestBody
} from '~/models/requests/User.requests'
import userService from '~/services/users.service'
import { jwtDecode } from 'jwt-decode'
import { pick } from 'lodash'

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req
  const user_id = user._id
  const result = await userService.login(user_id.toString())
  return res.status(200).json({
    message: USER_MESSAGE.LOGIN_SUCCESS,
    data: result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  //throw new Error('Loi')
  const result = await userService.register(req.body)
  return res.status(200).json({
    message: USER_MESSAGE.REGISTER_SUCCESS,
    data: result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  await userService.logout(refresh_token)
  return res.status(200).json({
    message: USER_MESSAGE.LOGOUT_SUCCESS
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const user = await userService.getMe(user_id)
  return res.status(200).json({
    message: USER_MESSAGE.GET_ME_SUCCESS,
    data: user
  })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const body = pick(req.body, [
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ])
  const user = await userService.updateMe(user_id, body)
  return res.status(200).json({
    message: USER_MESSAGE.UPDATE_ME_SUCCESS,
    data: user
  })
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const user_nanme = req.params.username
  const user = await userService.getProfile(user_nanme)
  return res.status(200).json({
    message: USER_MESSAGE.GET_PROFILE_SUCCESS,
    data: user
  })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const followed_user_id: string = req.body.followed_user_id
  const result = await userService.followUser(user_id, followed_user_id)
  return res.status(200).json({
    message: result
  })
}

export const unFollowUserController = async (
  req: Request<ParamsDictionary, any, UnFollowRequestParams>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const followed_user_id = req.params.followed_user_id

  const result = await userService.unFollowUser(user_id, followed_user_id)
  return res.status(200).json({
    message: result
  })
}

export const changePasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { new_password, new_password_confirm } = req.body
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const result = await userService.changePassword(new_password, new_password_confirm, user_id)
  return res.status(200).json({
    message: result
  })
}
