import User from '~/models/schemas/User.schema'
import databaseService from './database.service'

class UsersService {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(new User({ email: email, password: password }))
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
