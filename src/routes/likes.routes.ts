import { Router } from 'express'
import { bookMarkTweetController } from '~/controllers/bookmarks.controllers'
import { likeController, unLikeController } from '~/controllers/likes.controllers'
import { likeTweetValidator, unLikeTweetValidator } from '~/middlewares/likes.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likeRouter = Router()

/*
 - Description: like tweet
 - Path: /
 - Method: Post
 - Header: {Authorization: Bearer <access_token>}
 - Body: {'tweet_id' : string}
*/
likeRouter.post('/', accessTokenValidator, likeTweetValidator, wrapRequestHandler(likeController))

/*
 - Description: unlike tweet
 - Path: /tweet/:tweet_id
 - Method: Delete
 - Header: {Authorization: Bearer <access_token>}
*/
likeRouter.delete('/tweet/:tweet_id', accessTokenValidator, unLikeTweetValidator, wrapRequestHandler(unLikeController))

export default likeRouter
