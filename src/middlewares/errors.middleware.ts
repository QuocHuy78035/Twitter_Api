import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/http.status'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
}
