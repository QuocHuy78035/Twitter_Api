import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType, VerifyUserStatus } from '~/constants/enums'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import { hashPassword } from './crypto'
import tweetService from '~/services/tweets.service'
import { config } from 'dotenv'
import databaseService from '~/services/database.service'

config()
// password cho các fake user
const PASSWORD = 'Huypro03@'

// id tài khoản của mình dùng để follow người khác
const MYID = new ObjectId('6695cfeda54caf24ae2c3b39')

// số lượng user được tạo ra
const USER_COUNT = 100

const createRandomUser = (): RegisterRequestBody => {
  return {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
}

const createRandomTweet = (): TweetRequestBody => {
  return {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph(),
    parent_id: null,
    hashtags: [],
    mentions: [],
    medias: []
  }
}

const insertMultipleUsers = async (users: RegisterRequestBody[]) => {
  console.log('Creating user ...')

  const result = await Promise.all(
    (users || []).map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: VerifyUserStatus.Verified
        })
      )
      return user_id
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following ...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) => {
      return databaseService.followers.insertOne({
        user_id: user_id,
        followed_user_id: new ObjectId(followed_user_id)
      })
    })
  )
  console.log(`Followed ${result.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id) => {
      await Promise.all([
        tweetService.createTweet(createRandomTweet(), id.toString()),
        tweetService.createTweet(createRandomTweet(), id.toString())
      ])
      count += 2
      console.log(`Created ${count} tweets`)
    })
  )
  return result
}

;(async () => {
  const users: RegisterRequestBody[] = Array.from({ length: USER_COUNT }, createRandomUser)

  try {
    const ids = await insertMultipleUsers(users)
    await followMultipleUsers(MYID, ids)
    await insertMultipleTweets(ids)
  } catch (error) {
    console.error('Error processing users:', error)
  }
})()
