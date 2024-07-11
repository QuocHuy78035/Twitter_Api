import { ObjectId } from 'mongodb'
import databaseService from './database.service'
import Bookmark from '~/models/schemas/Bookmark.schema'

class BookMarkService {
  async bookMarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      { tweet_id: new ObjectId(tweet_id) },
      { $setOnInsert: new Bookmark({ user_id: user_id, tweet_id: tweet_id }) },
      { upsert: true, returnDocument: 'after' }
    )
    return result
  }

  async unBookMarkTweet(user_id: string, tweet_id: string) {
    console.log('user_id', user_id)
    console.log('tweet_id', tweet_id)
    const result = await databaseService.bookmarks.findOneAndDelete({
      tweet_id: new ObjectId(tweet_id),
      user_id: new ObjectId(user_id)
    })
    console.log(result)
    return result
  }
}

const bookMarkService = new BookMarkService()

export default bookMarkService
