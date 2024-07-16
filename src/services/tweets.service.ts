import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import databaseService from './database.service'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schema'

class TweetsService {
  async checkAndCreateHashtag(hashtags: string[]) {
    const hashtagsDocument = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )
    const lsitHashtagObjectId = hashtagsDocument.map((hashtag) => {
      return hashtag?._id
    })
    return lsitHashtagObjectId
  }

  async createTweet(body: TweetRequestBody, user_id: string) {
    const hashTagObjectId = await this.checkAndCreateHashtag(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        user_id: new ObjectId(user_id),
        audience: body.audience,
        content: body.content,
        hashtags: hashTagObjectId as [],
        medias: body.medias,
        mentions: body.mentions,
        parent_id: body.parent_id,
        type: body.type
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}

const tweetService = new TweetsService()
export default tweetService
