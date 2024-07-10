import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/*
 - Description: create tweet
 - Path: /
 - Method: Post
 - Header: {Authorization: Bearer <access_token>}
 - Body: TweetRequestBody
*/
tweetsRouter.post('/', accessTokenValidator, wrapRequestHandler(createTweetController))

export default tweetsRouter
