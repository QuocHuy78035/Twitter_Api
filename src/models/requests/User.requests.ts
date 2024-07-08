export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

// export interface ToKenPayload extends JwtPayload {
//   user_id: string
//   token_type: TokenType
// }
