import { isFalsy, isTruthy } from '@ethereumjs/util'
import * as tape from 'tape'

export function checkError(t: tape.Test, expectedCode: number, expectedMessage?: string) {
  return (res: any) => {
    if (isFalsy(res.body.error)) {
      throw new Error('should return an error object')
    }
    if (res.body.error.code !== expectedCode) {
      throw new Error(`should have an error code ${expectedCode}, got ${res.body.error.code}`)
    }
    if (
      isTruthy(expectedMessage) &&
      !(res.body.error.message as string).includes(expectedMessage)
    ) {
      throw new Error(
        `should have an error message "${expectedMessage}", got "${res.body.error.message}"`
      )
    }
    t.pass('should return error object with error code and message')
  }
}
