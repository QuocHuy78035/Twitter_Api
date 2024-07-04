import { Request, Response, NextFunction } from 'express'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: `Login success`
  })
}
