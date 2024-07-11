import { Router } from 'express'
import { bookMarkTweetController, unBookMarkTweetController } from '~/controllers/bookmarks.controllers'
import { uploadImageController } from '~/controllers/medias.controllers'
import { bookMarkTweetValidator, unBookmarkTweetValidator } from '~/middlewares/bookmarks.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookMarkRouter = Router()

/*
 - Description: bookmark tweet
 - Path: /
 - Method: Post
 - Header: {Authorization: Bearer <access_token>}
 - Body: {'tweet_id' : string}
*/
bookMarkRouter.post('/', accessTokenValidator, bookMarkTweetValidator, wrapRequestHandler(bookMarkTweetController))

/*
 - Description: unbookmark tweet
 - Path: /tweet/:tweet_id
 - Method: Delete
 - Header: {Authorization: Bearer <access_token>}
*/
bookMarkRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  unBookmarkTweetValidator,
  wrapRequestHandler(unBookMarkTweetController)
)

export default bookMarkRouter
