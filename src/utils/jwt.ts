import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { decode } from 'punycode'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (errors, token) => {
      if (errors) {
        throw reject(errors)
      }
      return resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPrivateKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPrivateKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPrivateKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decode as jwt.JwtPayload)
    })
  })
}
