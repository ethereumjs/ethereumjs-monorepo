import { createAddressFromString, createZeroAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  createEIP7708BurnLog,
  createEIP7708TransferLog,
  decodeEIP7708BurnLog,
  decodeEIP7708TransferLog,
} from '../src/index.ts'

import type { Log } from '../src/types.ts'

describe('[EVM/eip7708]: decode transfer and burn logs', () => {
  const from = createAddressFromString('0x00000000000000000000000000000000000000aa')
  const to = createAddressFromString('0x00000000000000000000000000000000000000bb')

  it('decodeEIP7708TransferLog() round-trips createEIP7708TransferLog()', () => {
    const log = createEIP7708TransferLog(from, to, 123n)
    const decoded = decodeEIP7708TransferLog(log)
    assert.deepEqual(decoded, { from: from.toString(), to: to.toString(), value: 123n })
  })

  it('decodeEIP7708BurnLog() round-trips createEIP7708BurnLog()', () => {
    const log = createEIP7708BurnLog(from, 7n)
    const decoded = decodeEIP7708BurnLog(log)
    assert.deepEqual(decoded, { account: from.toString(), value: 7n })
  })

  it('returns undefined for unrelated logs', () => {
    const unrelated: Log = [createZeroAddress().bytes, [], new Uint8Array(32)]
    assert.isUndefined(decodeEIP7708TransferLog(unrelated))
    assert.isUndefined(decodeEIP7708BurnLog(unrelated))
    assert.isUndefined(decodeEIP7708TransferLog(createEIP7708BurnLog(from, 1n)))
    assert.isUndefined(decodeEIP7708BurnLog(createEIP7708TransferLog(from, to, 1n)))
  })
})
