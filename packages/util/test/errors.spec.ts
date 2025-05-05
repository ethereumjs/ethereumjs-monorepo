import { assert, describe, it } from 'vitest'

import { DEFAULT_ERROR_CODE, EthereumJSError, EthereumJSErrorWithoutCode } from '../src/errors.ts'

const TEST_ERROR_CODE = 'TEST_ERROR_CODE'
const TEST_MSG = 'test error message'

describe('EthereumJSError', () => {
  it('should create an error with a code', () => {
    const error = new EthereumJSError({ code: TEST_ERROR_CODE }, TEST_MSG)
    assert.strictEqual(error.type.code, TEST_ERROR_CODE)
    assert.strictEqual(error.message, TEST_MSG)
    const object = error.toObject()
    assert.strictEqual(object.type.code, TEST_ERROR_CODE)
    assert.strictEqual(object.message, TEST_MSG)
  })

  it('should create an error using the ethereumjs error without code', () => {
    const error = EthereumJSErrorWithoutCode(TEST_MSG)
    assert.strictEqual(error.type.code, DEFAULT_ERROR_CODE)
    assert.strictEqual(error.message, TEST_MSG)
    const object = error.toObject()
    assert.strictEqual(object.type.code, DEFAULT_ERROR_CODE)
    assert.strictEqual(object.message, TEST_MSG)
  })
})
