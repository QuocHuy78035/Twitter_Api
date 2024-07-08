import User from '~/models/schemas/User.schema'
import databaseService from './database.service'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'

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
}

const userService = new UsersService()
export default userService
