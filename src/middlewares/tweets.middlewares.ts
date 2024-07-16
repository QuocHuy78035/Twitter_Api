import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, VerifyUserStatus } from '~/constants/enums'
import { TWEET_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { numberEnumToArr } from '~/utils/commons'
import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.service'
import Tweet from '~/models/schemas/Tweet.schema'
import { ErrorWithStatus } from '~/models/errors/Errors'
import HTTP_STATUS from '~/constants/http.status'
import { wrapRequestHandler } from '~/utils/handlers'
import { TokenPayLoad } from '~/models/requests/User.requests'
import { jwtDecode } from 'jwt-decode'

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
          if (type == TweetType.ReTweet && contents != '') {
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
        options: async (value, { req }) => {
          // const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          // if (!user) {
          //   throw new ErrorWithStatus({ message: USER_MESSAGE.USER_NOT_FOUND, status: HTTP_STATUS.BAD_REQUEST })
          // }

          //yeu cau moi phan tu trong array phai la user_id (Object id)
          const length = value.length
          for (let i = 0; i < length; i++) {
            if (!ObjectId.isValid(value[i])) {
              throw new Error(TWEET_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
          }
          // if (!value.every((item: any) => ObjectId.isValid(new ObjectId(value)))) {
          //   throw new Error(TWEET_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
          // }
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

  if (tweet.audience == TweetAudience.TwitterCircle) {
    const token = req.headers.authorization || ''
    const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
    const user_id = decoded.user_id
    if (!token) {
      throw new ErrorWithStatus({ message: USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED, status: HTTP_STATUS.UNAUTHORIZED })
    }

    //kiem tra tai khoan cua tac gia tweet co on dinh ko (con ton tai va khong bi ban)
    const author_id = tweet.user_id
    const author = await databaseService.users.findOne({ _id: author_id })
    if (!author || author.verify == VerifyUserStatus.Banned) {
      throw new ErrorWithStatus({ message: USER_MESSAGE.USER_NOT_FOUND, status: HTTP_STATUS.BAD_REQUEST })
    }

    //kiem tra nguoi xem tweet co nam trong tweet circle cua tac gia hay ko
    // if (!author.user_id_circle) {
    //   throw new ErrorWithStatus({
    //     message: '123',
    //     status: HTTP_STATUS.INTERNAL_SERVER_ERROR
    //   })
    // }

    const length = author.user_id_circle.length ?? 0
    let is_in_tweet_circle = false
    for (let i = 0; i < length; i++) {
      if (author.user_id_circle[0].toString() == user_id) {
        is_in_tweet_circle = true
      }
    }

    if (!is_in_tweet_circle || !author) {
      throw new ErrorWithStatus({
        message: TWEET_MESSAGE.TWEET_IS_NOT_PUBLIC,
        status: HTTP_STATUS.FORBIDEN
      })
    }
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
