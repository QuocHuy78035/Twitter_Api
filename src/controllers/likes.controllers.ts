import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { jwtDecode } from 'jwt-decode'
import { LIKE_MESSAGES } from '~/constants/message'
import { LikeRequestBody } from '~/models/requests/Like.request'
import { TokenPayLoad } from '~/models/requests/User.requests'
import likeService from '~/services/likes.service'

export const likeController = async (
  req: Request<ParamsDictionary, any, LikeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const tweet_id = req.body.tweet_id
  const tweet_liked = await likeService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGES.LIKE_TWEET_SUCCESS,
    tweet_liked
  })
}

export const unLikeController = async (
  req: Request<ParamsDictionary, any, LikeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const tweet_id = req.params.tweet_id
  likeService.unLikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGES.UN_LIKE_TWEET_SUCCESS
  })
}
