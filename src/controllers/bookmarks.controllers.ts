import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { jwtDecode } from 'jwt-decode'
import { BOOKMARK_MESSAGE } from '~/constants/message'
import { BookmarkRequestBody } from '~/models/requests/Bookmark.request'
import { TokenPayLoad } from '~/models/requests/User.requests'
import bookMarkService from '~/services/bookmarks.service'

export const bookMarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const tweet_id = req.body.tweet_id
  const bookmark = await bookMarkService.bookMarkTweet(user_id, tweet_id)
  console.log(bookmark)
  return res.json({
    message: BOOKMARK_MESSAGE.ADD_TWEET_TO_BOOKMARK_SUCCESS,
    bookmark
  })
}

export const unBookMarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const tweet_id = req.params.tweet_id
  await bookMarkService.unBookMarkTweet(user_id, tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGE.UN_BOOKMARK_SUCCESS
  })
}
