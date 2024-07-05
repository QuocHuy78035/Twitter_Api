import { Router } from 'express'
import { query, validationResult } from 'express-validator'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

userRouter.get('/hello', query('person').notEmpty(), (req, res) => {
  const result = validationResult(req)
  if (result.isEmpty() && req.query) {
    res.send(`Hello, ${req.query.person}!`)
  }
  res.send({ error: result.array() })
})

userRouter.post('/login', loginValidator, loginController)
userRouter.post('/register', registerValidator, registerController)

export default userRouter
