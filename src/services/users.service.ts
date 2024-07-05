import User from '~/models/schemas/User.schema'
import databaseService from './database.service'
import { RegisterRequestBody } from '~/models/requests/User.requests'

class UsersService {
  async register(payload: RegisterRequestBody) {
    const result = await databaseService.users.insertOne(
      //date_of_birth: new Date(payload.date_of_birth) vi date of birth quy dinh trong userSchema la kieu Date => convert string iso nguoi dung truyen vao sang Date()
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth) })
    )
    return result
  }

  async checkEmailExit(email: string) {
    const user = await databaseService.users.findOne({ email })
    if (user) {
      return true
    }
    return false
  }
}

const userService = new UsersService()
export default userService
