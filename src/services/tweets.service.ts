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

  async getTweetDetail(tweet_id: string) {
    const tweet = await databaseService.tweets
      .aggregate<Tweet>([
        {
          $match: {
            _id: new ObjectId(`${tweet_id}`)
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $match: {
            _id: new ObjectId(tweet_id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            audience: 1,
            content: 1,
            parent_id: 1,
            hashtags: 1,
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mention',
                in: {
                  _id: '$$mention._id',
                  name: '$$mention.name',
                  email: '$$mention.email',
                  username: '$$mention.username'
                }
              }
            },
            medias: 1,
            guest_viewd: 1,
            user_viewed: 1
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'tweet_id',
            as: 'likes'
          }
        },
        {
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'tweet_child'
          }
        },
        {
          $addFields: {
            bookmarks: {
              $size: '$bookmarks'
            },
            likes: {
              $size: '$likes'
            },
            retweet_count: {
              $size: {
                $filter: {
                  input: '$tweet_child',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 1]
                  }
                }
              }
            },
            comment_count: {
              $size: {
                $filter: {
                  input: '$tweet_child',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 2]
                  }
                }
              }
            },
            quote_count: {
              $size: {
                $filter: {
                  input: '$tweet_child',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 3]
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            tweet_child: 0
          }
        }
      ])
      .toArray()

    if (tweet.length == 0) {
      return []
    }
    return tweet
  }

  async increaseView(tweet_id: string, user_id?: string) {
    const increase = user_id ? { user_viewed: 1 } : { guest_viewd: 1 }
    const result = (await databaseService.tweets.findOneAndUpdate(
      {
        _id: new ObjectId(tweet_id)
      },
      {
        $inc: increase,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_viewd: 1,
          user_viewed: 1
        }
      }
    )) as { guest_viewd: number; user_viewed: number }
    return result
  }
}

const tweetService = new TweetsService()
export default tweetService
