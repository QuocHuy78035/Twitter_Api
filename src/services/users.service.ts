import User from '~/models/schemas/User.schema'
import databaseService from './database.service'
import { RegisterRequestBody, UpdateMeRequestBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { USER_MESSAGE } from '~/constants/message'
import Follower from '~/models/schemas/Follower.schema'
config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async register(payload: RegisterRequestBody) {
    const result = await databaseService.users.insertOne(
      //date_of_birth: new Date(payload.date_of_birth) vi date of birth quy dinh trong userSchema la kieu Date => convert string iso nguoi dung truyen vao sang Date()
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(user_id)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(user_id) })
    )
    return {
      user_id,
      accessToken,
      refreshToken
    }
  }

  async checkEmailExit(email: string) {
    const user = await databaseService.users.findOne({ email })
    if (user) {
      return true
    }
    return false
  }

  async login(user_id: string) {
    const [accessToken, refreshToken] = await this.signAccessTokenAndRefreshToken(user_id)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ token: refreshToken, user_id: new ObjectId(user_id) })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshToken.deleteOne({ token: refresh_token })
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, body: UpdateMeRequestBody) {
    const _body = body.date_of_birth ? { ...body, date_of_birth: new Date(body.date_of_birth) } : body
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: { ...(_body as UpdateMeRequestBody & { date_of_birth?: Date }) },
        $currentDate: {
          update_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0
        }
      }
    )
    return user
  }

  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username: username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0,
          update_at: 0
        }
      }
    )
    return user
  }

  async followUser(user_id: string, followed_user_id: string) {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (!follower) {
      await databaseService.followers.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
      return USER_MESSAGE.FOLLOW_SUCCESSFULLY
    }
    return USER_MESSAGE.ALREADY_FOLLOWED_USER
  }

  async unFollowUser(user_id: string, followed_user_id: string) {
    const user_followed = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (!user_followed) {
      return USER_MESSAGE.NOT_FOLLOW_USER
    } else {
      await databaseService.followers.deleteOne({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id)
      })
      return USER_MESSAGE.UN_FOLLOW_SUCCESS
    }
  }
}

const userService = new UsersService()
export default userService
