import * as tape from 'tape'

export function checkError(t: tape.Test, expectedCode: any, expectedMessage?: any) {
  return (res: any) => {
    if (!res.body.error) {
      throw new Error('should return an error object')
    }
    if (res.body.error.code !== expectedCode) {
      throw new Error(`should have an error code ${expectedCode}, got ${res.body.error.code}`)
    }
    if (expectedMessage && !res.body.error.message.includes(expectedMessage)) {
      throw new Error(
        `should have an error message "${expectedMessage}", got "${res.body.error.message}"`
      )
    }
    t.pass('should return error object with error code and message')
  }
}
