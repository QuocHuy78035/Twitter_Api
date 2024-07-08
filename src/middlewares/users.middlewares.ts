import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { values } from 'lodash'
import HTTP_STATUS from '~/constants/http.status'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithMessage } from '~/models/errors/Errors'
import databaseService from '~/services/database.service'
import userService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
      },
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
      },
      trim: true,
      isLength: {
        errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_6_TO_255,
        options: {
          min: 6,
          max: 255
        }
      },
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })
          if (user == null) {
            throw new ErrorWithMessage({
              message: USER_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          req.user = user
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
        errorMessage: USER_MESSAGE.PASSWORD_IS_NOT_STRONG
      },
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        errorMessage: USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_6_255,
        options: {
          min: 6,
          max: 255
        }
      }
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USER_MESSAGE.NAME_IS_REQUIRED
      },
      trim: true,
      isString: {
        errorMessage: USER_MESSAGE.NAME_IS_STRING
      },
      isLength: {
        errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_1_TO_100,
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      isEmail: {
        errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
      },
      notEmpty: {
        errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
      },
      trim: true,
      isLength: {
        errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_6_TO_255,
        options: {
          min: 6,
          max: 255
        }
      },
      custom: {
        options: async (value) => {
          const isExitEmail = await userService.checkEmailExit(value)
          if (isExitEmail) {
            throw new ErrorWithMessage({ message: USER_MESSAGE.EMAIL_ALREADY_EXIT, status: HTTP_STATUS.BAD_REQUEST })
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
        errorMessage: USER_MESSAGE.PASSWORD_IS_NOT_STRONG
      },
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        errorMessage: USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_6_255,
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
        errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_IS_NOT_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value != req.body.password) {
            throw new Error(USER_MESSAGE.PASSWORD_AND_PASSWORD_CONFIRM_NOT_MATCH)
          }
          return true
        }
      },
      notEmpty: {
        errorMessage: USER_MESSAGE.COMFIRM_PASSWORD_IS_REQUIRED
      },
      isString: true,
      trim: true,
      isLength: {
        errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_6_255,
        options: {
          min: 6,
          max: 255
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        errorMessage: USER_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601_FORMAT,
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
