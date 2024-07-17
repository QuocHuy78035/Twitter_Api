import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response, NextFunction } from 'express'
import { SearchQuery } from '~/models/requests/Search.querry'
import searchService from '~/services/search.service'
import { TWEET_MESSAGE } from '~/constants/message'

export const searchController = async (
  req: Request<ParamsDictionary, any, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const result = await searchService.search({ content: req.query.content as string })
  return res.status(200).json({
    message: TWEET_MESSAGE.GET_TWEET_SUCCESS,
    result
  })
}
