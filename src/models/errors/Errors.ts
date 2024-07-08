import HttpStatusCode from '~/constants/http.status'
import { USER_MESSAGE } from '~/constants/message'

type ErrorsType = Record<
  string,
  {
    msg: string
    // location: string
    // value: any
    // path: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = USER_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HttpStatusCode.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
