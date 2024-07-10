import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.service'
import { defaultErrorHandler } from './middlewares/errors.middleware'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { UPLOAD_DIR } from './constants/dir'
import tweetsRouter from './routes/tweets.routes'
import { config } from 'dotenv'
const app = express()
config()

const port = process.env.PORT || 4000

initFolder()

app.use('/static/image/', express.static(UPLOAD_DIR))
app.use(express.json()) //hoan doi json gui tu client thanh object
app.use('/users', userRouter)
app.use('/medias', mediaRouter)
app.use('/tweets', tweetsRouter)
app.use(defaultErrorHandler)

databaseService.connect()

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
