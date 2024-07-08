import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/http.status'
import { EntityError, ErrorWithStatus } from '~/models/errors/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const error = validationResult(req)
    if (error.isEmpty()) {
      return next()
    }

    const errorObject = error.mapped()
    const errorEntity = new EntityError({ errors: {} })
    for (const key in errorObject) {
      const { msg } = errorObject[key]
      console.log(errorObject[key])
      if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      errorEntity.errors[key] = errorObject[key]
    }
    next(errorEntity)
  }
}
