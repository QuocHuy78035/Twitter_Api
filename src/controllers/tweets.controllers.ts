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
  return res.status(201).json({ message: TWEET_MESSAGE.CREATE_TWEET_SUCCESS, tweet })
}

export const getTweetController = async (
  req: Request<ParamsDictionary, any, TweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const tweet_id = req.params.tweet_id
  let result
  if (req.headers.authorization) {
    const token = req.headers.authorization
    const decoded: TokenPayLoad = jwtDecode<TokenPayLoad>(token)
    const user_id: string = decoded.user_id
    result = await tweetService.increaseView(tweet_id, user_id)
  } else {
    result = await tweetService.increaseView(tweet_id)
  }
  const tweet = await tweetService.getTweetDetail(tweet_id)
  const tweet_result = {
    ...tweet,
    guest_viewd: result.guest_viewd,
    user_viewed: result.user_viewed,
    view: result.guest_viewd + result.user_viewed
  }
  return res.json({ message: TWEET_MESSAGE.GET_TWEET_SUCCESS, tweet_result })
}
