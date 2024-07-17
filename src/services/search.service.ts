import { SearchQuery } from '~/models/requests/Search.querry'
import databaseService from './database.service'
import { query } from 'express'

class SearchService {
  async search(query: SearchQuery) {
    const tweets = await databaseService.tweets.find({ $text: { $search: query.content } }).toArray()
    return tweets
  }
}

const searchService = new SearchService()
export default searchService
