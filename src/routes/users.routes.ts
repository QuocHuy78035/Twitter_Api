import { Router } from 'express'
import { query, validationResult } from 'express-validator'
import { loginController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

userRouter.get('/hello', query('person').notEmpty(), (req, res) => {
  const result = validationResult(req)
  if (result.isEmpty() && req.query) {
    res.send(`Hello, ${req.query.person}!`)
  }
  res.send({ error: result.array() })
})

userRouter.post('/login', loginValidator, loginController)

export default userRouter
