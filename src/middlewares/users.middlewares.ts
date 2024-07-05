import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/http.status'
import { ErrorWithMessage } from '~/models/errors/Errors'
import userService from '~/services/users.service'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: `Missing email or password`
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      trim: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      isEmail: true,
      notEmpty: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      },
      custom: {
        options: async (value) => {
          const isExitEmail = await userService.checkEmailExit(value)
          if (isExitEmail) {
            throw new ErrorWithMessage({ message: 'Email already exits', status: HTTP_STATUS.BAD_REQUEST })
          }
          return true
        }
      }
    },
    password: {
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: `Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.`
      },
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      }
    },
    confirm_password: {
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: `Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.`
      },
      custom: {
        options: (value, { req }) => {
          if (value != req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      },
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)