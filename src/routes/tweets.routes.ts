import { Router } from 'express'
import { createTweetController, getTweetController } from '~/controllers/tweets.controllers'
import { audienceValidator, createTweetValidator, TweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, IsUserLogedInValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/*
 - Description: create tweet
 - Path: /
 - Method: Post
 - Header: {Authorization: Bearer <access_token>}
 - Body: TweetRequestBody
*/
tweetsRouter.post('/', accessTokenValidator, createTweetValidator, wrapRequestHandler(createTweetController))

/*
 - Description: get tweet detail
 - Path: /:tweet_id
 - Method: get
 - Header: {Authorization: Bearer <access_token>}
 - Params: tweet_id: string
*/
tweetsRouter.get(
  '/:tweet_id',
  IsUserLogedInValidator(accessTokenValidator),
  TweetIdValidator,
  IsUserLogedInValidator(audienceValidator),
  wrapRequestHandler(getTweetController)
)

export default tweetsRouter
