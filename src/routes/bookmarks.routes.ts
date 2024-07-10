import { Router } from 'express'
import { bookMarkTweetController } from '~/controllers/bookmarks.controllers'
import { uploadImageController } from '~/controllers/medias.controllers'
import { bookMarkTweetValidator } from '~/middlewares/bookmarks.middlewares'
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

export default bookMarkRouter
