import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.service'
import { defaultErrorHandler } from './middlewares/errors.middleware'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { UPLOAD_DIR } from './constants/dir'
const app = express()

const PORT = 3000

initFolder()

app.use('/static/image/', express.static(UPLOAD_DIR))
app.use(express.json()) //hoan doi json gui tu client thanh object
app.use('/users', userRouter)
app.use('/medias', mediaRouter)
app.use(defaultErrorHandler)

databaseService.connect()

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
