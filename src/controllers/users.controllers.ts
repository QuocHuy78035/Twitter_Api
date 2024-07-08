import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_MESSAGE } from '~/constants/message'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import userService from '~/services/users.service'

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
