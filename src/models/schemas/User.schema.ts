import { ObjectId } from 'mongodb'

interface UserType {
  _id?: ObjectId
  name?: string
  email: string
  date_of_birth?: Date
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string // jwt hoac '' neu da verify email
  forgot_password_token?: string //jwt hoac '' neu da xac thuc email
  verify?: VerifyUserStatus

  bio?: string //optional
  location?: string //optional
  website?: string //option
  username?: string //option
  avatar?: string //optional
  cover_photo?: string //optional
}

enum VerifyUserStatus {
  Unverified, //chua verify mac dinh = 0
  Verified, //da verify
  Banned //tai khoan bi ban
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string // jwt hoac '' neu da verify email
  forgot_password_token: string //jwt hoac '' neu da xac thuc email
  verify: VerifyUserStatus

  bio: string //optional
  location: string //optional
  website: string //option
  username: string //option
  avatar: string //optional
  cover_photo: string //optional

  constructor(user: UserType) {
    ;(this._id = user._id),
      (this.name = user.name || ''),
      (this.email = user.email),
      (this.date_of_birth = user.date_of_birth || new Date()),
      (this.password = user.password),
      (this.created_at = user.created_at || new Date()),
      (this.updated_at = user.updated_at || new Date()),
      (this.email_verify_token = user.email_verify_token || ''),
      (this.forgot_password_token = user.forgot_password_token || ''),
      (this.verify = user.verify || VerifyUserStatus.Unverified),
      (this.bio = user.bio || ''),
      (this.location = user.location || ''),
      (this.website = user.website || ''),
      (this.username = user.username || ''),
      (this.avatar = user.avatar || ''),
      (this.cover_photo = user.cover_photo || '')
  }
}
