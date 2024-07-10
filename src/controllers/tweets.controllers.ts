import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { jwtDecode } from 'jwt-decode'
import { TWEET_MESSAGE } from '~/constants/message'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import { TokenPayLoad } from '~/models/requests/User.requests'
import tweetService from '~/services/tweets.service'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization || ''
  const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
  const user_id: string = decoded.user_id
  const tweet = await tweetService.createTweet(req.body, user_id)
  return res.json({ message: TWEET_MESSAGE.CREATE_TWEET_SUCCESS, tweet })
}
