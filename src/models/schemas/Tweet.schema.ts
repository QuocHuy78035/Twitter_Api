import { ObjectId } from 'mongodb'
import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Others'

//de goi ra va lam viec
interface TweetConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //null khi la tweet goc
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  guest_viewd?: number
  user_viewed?: number
  created_at?: Date
  updated_at?: Date
}

//de luu vao db
export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //null khi la tweet goc
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_viewd: number
  user_viewed: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    user_id,
    audience,
    content,
    guest_viewd,
    hashtags,
    medias,
    mentions,
    parent_id,
    type,
    user_viewed,
    created_at,
    updated_at
  }: TweetConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.audience = audience
    this.content = content
    this.guest_viewd = guest_viewd || 0
    this.hashtags = hashtags
    this.medias = medias
    this.mentions = mentions.map((item) => new ObjectId(item))
    this.parent_id = parent_id != null ? new ObjectId(parent_id) : null
    this.type = type
    this.user_viewed = user_viewed || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
