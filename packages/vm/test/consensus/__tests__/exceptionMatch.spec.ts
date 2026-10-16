import assert from 'node:assert/strict'
import { describe, it } from 'vitest'

import { expectExceptionMatches, thrownMessage } from '../cases/exceptionMatch.ts'
import { formatCaseError } from '../cases/runFile.ts'

describe('[VM/consensus]: exception match', () => {
  it('matches EIP-7825 cap on message without stack', () => {
    const err = new Error(
      'Transaction gas limit 16777217 exceeds the maximum allowed by EIP-7825 (16777216)',
    )
    assert.ok(expectExceptionMatches('TransactionException.GAS_LIMIT_EXCEEDS_MAXIMUM', err))
  })

  it('matches invalid base fee on message only', () => {
    const err = new Error('Invalid block: base fee not correct hf=prague number=2')
    assert.ok(expectExceptionMatches('BlockException.INVALID_BASEFEE_PER_GAS', err))
  })

  it('matches typed tx y-parity under INVALID_SIGNATURE_VRS', () => {
    const err = new Error('The y-parity of the transaction should either be 0 or 1')
    assert.ok(expectExceptionMatches('TransactionException.INVALID_SIGNATURE_VRS', err))
  })

  it('matches EIP-8037 total gas cap under GAS_LIMIT_EXCEEDS_MAXIMUM', () => {
    const err = new Error(
      'Transaction gas limit 4294967296 exceeds the maximum total gas limit (4294967295)',
    )
    assert.ok(expectExceptionMatches('TransactionException.GAS_LIMIT_EXCEEDS_MAXIMUM', err))
  })

  it('matches high-s under INVALID_SIGNATURE_VRS', () => {
    const err = new Error(
      'Invalid Signature: s-values greater than secp256k1n/2 are considered invalid',
    )
    assert.ok(expectExceptionMatches('TransactionException.INVALID_SIGNATURE_VRS', err))
  })

  it('formatCaseError() includes AssertionError actual and expected', () => {
    try {
      assert.strictEqual('a', 'b')
    } catch (e: unknown) {
      const text = formatCaseError(e)
      assert.match(text, /AssertionError actual/)
      assert.match(text, /AssertionError expected/)
    }
  })

  it('thrownMessage() returns Error.message', () => {
    assert.equal(thrownMessage(new Error('hello')), 'hello')
  })
})
