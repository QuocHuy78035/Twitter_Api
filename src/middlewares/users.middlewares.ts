import { error } from 'console'
import { check, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/http.status'
import { USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import databaseService from '~/services/database.service'
import userService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGE.EMAIL_IS_INVALID
        },
        notEmpty: {
          errorMessage: USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        //trim: true,
        isLength: {
          errorMessage: USER_MESSAGE.EMAIL_LENGTH_MUST_BE_6_TO_255,
          options: {
            min: 6,
            max: 255
          }
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user == null) {
              throw new ErrorWithStatus({
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
        //trim: true,
        isLength: {
          errorMessage: USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_6_255,
          options: {
            min: 6,
            max: 255
          }
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGE.NAME_IS_REQUIRED
        },
        //trim: true,
        isString: {
          errorMessage: USER_MESSAGE.NAME_IS_STRING
        },
        isLength: {
          errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_3_TO_100,
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
        //trim: true,
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
              throw new ErrorWithStatus({ message: USER_MESSAGE.EMAIL_ALREADY_EXIT, status: HTTP_STATUS.BAD_REQUEST })
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
        //trim: true,
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
        //trim: true,
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
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (access_token == null) {
              throw new ErrorWithStatus({
                message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_authorization = await verifyToken({ token: access_token })
              req.decoded_authorization = decoded_authorization
            } catch (e) {
              throw new ErrorWithStatus({
                message: `Access token is ${(e as JsonWebTokenError).message}`,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USER_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              if (value == null) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_IS_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              const decoded_refresh_token = await verifyToken({ token: value })
              const refresh_token = await databaseService.refreshToken.findOne({ token: value })
              if (refresh_token == null) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_IS_NOT_EXITS,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (e) {
              if (e instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGE.REFRESH_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw e
            }
          }
        }
      }
    },
    ['body']
  )
)

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        //trim: true,
        isString: {
          errorMessage: USER_MESSAGE.NAME_IS_STRING
        },
        isLength: {
          errorMessage: USER_MESSAGE.NAME_LENGTH_MUST_BE_3_TO_100,
          options: {
            min: 3,
            max: 100
          }
        }
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          errorMessage: USER_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO8601_FORMAT,
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGE.BIO_MUST_BA_A_STRING
        }
      },
      location: {
        optional: true,
        //trim: true,
        isString: {
          errorMessage: USER_MESSAGE.LOCATION_MUST_BE_A_STRING
        }
      },
      website: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGE.WEBSITE_MUST_BE_A_STRING
        }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGE.USER_NAME_MUST_BE_A_STRING
        }
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGE.AVATAR_MUST_BE_A_STRING
        }
      },
      cover_photo: {
        optional: true,
        isString: {
          errorMessage: USER_MESSAGE.COVER_PHOTO_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)
