import { assert } from 'vitest'

export function checkError(expectedCode: number, expectedMessage?: string) {
  return (res: any) => {
    if (res.body.error === undefined) {
      throw new Error('should return an error object')
    }
    if (res.body.error.code !== expectedCode) {
      throw new Error(`should have an error code ${expectedCode}, got ${res.body.error.code}`)
    }
    if (
      expectedMessage !== undefined &&
      !(res.body.error.message as string).includes(expectedMessage)
    ) {
      throw new Error(
        `should have an error message "${expectedMessage}", got "${res.body.error.message}"`
      )
    }
    assert.ok(true, 'should return error object with error code and message')
  }
}
