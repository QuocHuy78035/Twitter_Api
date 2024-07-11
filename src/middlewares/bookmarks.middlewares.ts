import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/http.status'
import { TWEET_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { ErrorWithStatus } from '~/models/errors/Errors'
import databaseService from '~/services/database.service'
import { validate } from '~/utils/validation'

export const bookMarkTweetValidator = validate(
  checkSchema(
    {
      tweet_id: {
        notEmpty: {
          errorMessage: TWEET_MESSAGE.TWEET_ID_CANNOT_EMPTY
        },
        custom: {
          options: async (value, { req }) => {
            const tweet = await databaseService.tweets.findOne({ _id: new ObjectId(value) })
            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEET_MESSAGE.TWEET_WITH_TWEET_ID_NOT_FOUND,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const unBookmarkTweetValidator = validate(
  checkSchema(
    {
      tweet_id: {
        notEmpty: {
          errorMessage: TWEET_MESSAGE.TWEET_ID_CANNOT_EMPTY
        },
        custom: {
          options: async (value, { req }) => {
            const tweet = await databaseService.tweets.findOne({ _id: value })
            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEET_MESSAGE.TWEET_WITH_TWEET_ID_NOT_FOUND,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
