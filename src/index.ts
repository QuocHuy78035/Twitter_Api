import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.service'
const app = express()

const PORT = 3000

app.use(express.json()) //hoan doi json gui tu client thanh object
app.use('/users', userRouter)

databaseService.connect()

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
