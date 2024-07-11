import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Like from '~/models/schemas/Like.schema'

class LikeService {
  async likeTweet(user_id: string, tweet_id: string) {
    const tweet_liked = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({ user_id: user_id, tweet_id: tweet_id })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return tweet_liked
  }

  async unLikeTweet(user_id: string, tweet_id: string) {
    await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
  }
}

const likeService = new LikeService()
export default likeService
