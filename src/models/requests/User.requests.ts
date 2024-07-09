import { TokenType } from '~/constants/enums'

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface TokenPayLoad {
  user_id: string
  token_type: TokenType
  iat: number
  exp: number
}

export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowRequestBody {
  followed_user_id: string
}

export interface UnFollowRequestParams {
  user_id: string
}

// export interface ToKenPayload extends JwtPayload {
//   user_id: string
//   token_type: TokenType
// }
