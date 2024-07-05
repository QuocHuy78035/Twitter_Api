import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import userService from '~/services/users.service'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: `Login success`
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  try {
    const result = await userService.register(req.body)
    return res.status(200).json({
      message: `Register success`,
      data: result
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      error: `Register failed`
    })
  }
}
