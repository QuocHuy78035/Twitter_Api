import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { TWEET_MESSAGE } from '~/constants/message'
import { numberEnumToArr } from '~/utils/commons'
import { validate } from '~/utils/validation'

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
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          //yeu cau moi phan tu trong array phai la Media object
          if (
            value.some((item: any) => {
              return typeof item.url != 'string' || !media_type.includes(item.type)
            })
          ) {
            throw new Error(TWEET_MESSAGE.MEDIA_MSUT_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
        }
      }
    }
  })
)
