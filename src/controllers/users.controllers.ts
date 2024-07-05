import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.service'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: `Login success`
  })
}

export const registerController = async (req: Request<ParamsDictionary>, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await userService.register({ email, password })
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
