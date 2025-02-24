import { assert, describe, it } from 'vitest'

import { EthereumJSError, EthereumJSErrorUnsetCode } from '../src/errors.js'

enum EthereumJSErrorType {
  ETHEREUMJS_ERROR = 'ETHEREUMJS_ERROR',
  ETHEREUMJS_UNSET_ERROR_CODE = 'ETHEREUMJS_UNSET_ERROR_CODE',
}

describe('EthereumJSError', () => {
  it('should create an error with a code', () => {
    const error = new EthereumJSError({ code: EthereumJSErrorType.ETHEREUMJS_ERROR }, 'test error')
    assert.equal(error.type.code, 'ETHEREUMJS_ERROR')
    assert.equal(error.message, 'test error')
    const object = error.toObject()
    assert.equal(object.type.code, 'ETHEREUMJS_ERROR')
    assert.equal(object.message, 'test error')
  })

  it('should create an error using the unset code', () => {
    const error = EthereumJSErrorUnsetCode('test error')
    assert.equal(error.type.code, 'ETHEREUMJS_UNSET_ERROR_CODE')
    assert.equal(error.message, 'test error')
    const object = error.toObject()
    assert.equal(object.type.code, 'ETHEREUMJS_UNSET_ERROR_CODE')
    assert.equal(object.message, 'test error')
  })
})
