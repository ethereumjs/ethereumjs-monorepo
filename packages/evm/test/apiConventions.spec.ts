import { EthereumJSError } from '@ethereumjs/util'
import { EventEmitter } from 'eventemitter3'
import { assert, describe, it } from 'vitest'

import { EVMError, EVMErrorCode, createEVM } from '../src/index.ts'

// D-ERR-1: EVMError aligns with the shared error taxonomy by exposing a stable `code`,
// without being reparented (so `instanceof EVMError` keeps working).
describe('API conventions: EVMError code & taxonomy (D-ERR-1)', () => {
  it('exposes a stable namespaced code derived from the message', () => {
    const err = new EVMError(EVMError.errorMessages.OUT_OF_GAS)
    assert.strictEqual(err.code, EVMErrorCode.OUT_OF_GAS)
    assert.strictEqual(err.code, 'EVM_OUT_OF_GAS')
    assert.strictEqual(typeof err.code, 'string')
  })

  it('accepts an explicit code override', () => {
    const err = new EVMError(EVMError.errorMessages.REVERT, 'EVM_CUSTOM')
    assert.strictEqual(err.code, 'EVM_CUSTOM')
    assert.strictEqual(err.error, EVMError.errorMessages.REVERT)
  })

  it('is not reparented: instanceof EVMError still holds and it is not an Error', () => {
    const err = new EVMError(EVMError.errorMessages.STACK_UNDERFLOW)
    assert.isTrue(err instanceof EVMError)
    assert.isFalse(err instanceof Error)
  })

  it('EthereumJSError conforms to the same `code` contract (mirrors type.code)', () => {
    const err = new EthereumJSError({ code: 'SOME_CODE' })
    assert.strictEqual(err.code, 'SOME_CODE')
    assert.isTrue(err instanceof Error)
  })
})

// D-EVT-1: `events` is always defined at runtime on the EVM class.
describe('API conventions: EVM events always-defined (D-EVT-1)', () => {
  it('createEVM().events is always a defined EventEmitter', async () => {
    const evm = await createEVM()
    assert.instanceOf(evm.events, EventEmitter)
  })
})
