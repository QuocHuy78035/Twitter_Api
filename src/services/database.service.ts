import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.nnl8npi.mongodb.net/`

export class DatabaseService {
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    try {
      await this.client.db(`admin`).command({ ping: 1 })
      console.log('Connect to mongoDB successfully!')
    } finally {
      await this.client.close()
    }
  }
}

//tao object tu class DatabaseService
const databaseService = new DatabaseService()
export default databaseService
