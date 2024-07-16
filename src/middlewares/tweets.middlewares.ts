import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, VerifyUserStatus } from '~/constants/enums'
import { LIKE_MESSAGES, TWEET_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { numberEnumToArr } from '~/utils/commons'
import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.service'
import Tweet from '~/models/schemas/Tweet.schema'
import { ErrorWithStatus } from '~/models/errors/Errors'
import HTTP_STATUS from '~/constants/http.status'
import { wrapRequestHandler } from '~/utils/handlers'

const tweet_type = numberEnumToArr(TweetType)
const tweet_audience = numberEnumToArr(TweetAudience)
const media_type = numberEnumToArr(MediaType)

export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweet_type],
        errorMessage: TWEET_MESSAGE.INVALID_TWEET_TYPE
      }
    },
    audience: {
      isIn: {
        options: [tweet_audience],
        errorMessage: TWEET_MESSAGE.INVALID_TWEET_AUDIENCE
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          //if type is retweet/ comment/ quotetweet => parent_id not null and parent_id is tweet_parent_id (Object id)
          if ([TweetType.ReTweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEET_MESSAGE.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
          }
          //if type is tweet => parent_id is null
          if (type == TweetType.Tweet && value != null) {
            throw new Error(TWEET_MESSAGE.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtag as string[]
          const mentions = req.body.mentions as string[]
          const contents = req.body.content
          //if type is comment/ quotetweet/ tweet and dont have mentions and hashtags => content must be string and not null
          if (
            [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            contents == null
          ) {
            throw new Error(TWEET_MESSAGE.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
          }
          //if type is retweet => content is null
          if (type == TweetType.ReTweet && contents != null) {
            throw new Error(TWEET_MESSAGE.COTENT_MUST_BE_EMPTY_STRING)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          //yeu cau moi phan tu trong array phai la string
          if (!value.every((item: any) => typeof item == 'string')) {
            throw new Error(TWEET_MESSAGE.HASHTAG_MUST_BE_AN_ARRAY_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          //yeu cau moi phan tu trong array phai la user_id (Object id)
          if (!value.every((item: any) => ObjectId.isValid(value))) {
            throw new Error(TWEET_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // console.log(1)
          // const result = value.some((item: any) => {
          //   return typeof item.url != 'string' || !media_type.includes(item.type)
          // })
          // console.log('result', result)
          //yeu cau moi phan tu trong array phai la Media object
          if (
            value.some((item: any) => {
              return typeof item.url != 'string' || !media_type.includes(item.type)
            })
          ) {
            throw new Error(TWEET_MESSAGE.MEDIA_MSUT_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)

export const audienceValidator = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tweet_id = req.params.tweet_id
  const tweet = (await databaseService.tweets.findOne({ _id: new ObjectId(tweet_id) })) as Tweet
  const author_id = tweet.user_id
  const author = await databaseService.users.findOne({ _id: author_id })

  if (tweet.audience == TweetAudience.TwitterCircle) {
    const user_id = req.headers.authorization
    if (!user_id) {
      throw new ErrorWithStatus({ message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
    }

    //check user co nam trong tweet_circle cua tac gia hay ko
    const is_in_twitter_circle = author?.user_id_circle.some((user_circle_id) => user_circle_id.equals(user_id))
    console.log(1111)
    if (!is_in_twitter_circle) {
      throw new ErrorWithStatus({ message: TWEET_MESSAGE.TWEET_IS_NOT_PUBLIC, status: HTTP_STATUS.FORBIDEN })
    }
  }

  //kiem tra tai khoan cua tac gia tweet co on dinh ko (con ton tai va khong bi ban)
  if (!author || author.verify == VerifyUserStatus.Banned) {
    throw new ErrorWithStatus({ message: USER_MESSAGE.USER_NOT_FOUND, status: HTTP_STATUS.BAD_REQUEST })
  }
  next()
})

export const TweetIdValidator = validate(
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
    ['params']
  )
)
