import { Router } from 'express'
import { searchController } from '~/controllers/searchs.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const searchsRouter = Router()

/*
 - Description: search tweet
 - Path: /tweets
 - Method: get
 - Body: SearchQuery
*/
searchsRouter.get('/tweets', wrapRequestHandler(searchController))

export default searchsRouter
