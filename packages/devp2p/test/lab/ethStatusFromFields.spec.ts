import { bytesToBigInt } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { ethStatusFromFields } from '../../src/lab/messages/eth.ts'

describe('[DevP2P/Lab]: ethStatusFromFields', () => {
  it('copies latestBlock into earliestBlock when earliest omitted (eth/69+)', () => {
    const status = ethStatusFromFields(
      {
        td: '0x01',
        bestHash: '0x' + '11'.repeat(32),
        genesisHash: '0x' + '22'.repeat(32),
        latestBlock: '0xb7663f',
      },
      69,
    )
    assert.equal(bytesToBigInt(status.earliestBlock!), 0xb7663fn)
    assert.equal(bytesToBigInt(status.latestBlock!), 0xb7663fn)
  })

  it('preserves explicit earliestBlock 0', () => {
    const status = ethStatusFromFields(
      {
        td: '0x01',
        bestHash: '0x' + '11'.repeat(32),
        genesisHash: '0x' + '22'.repeat(32),
        latestBlock: '0x64',
        earliestBlock: '0x0',
      },
      69,
    )
    assert.equal(bytesToBigInt(status.earliestBlock!), 0n)
    assert.equal(bytesToBigInt(status.latestBlock!), 0x64n)
  })

  it('ignores earliestBlock on eth/68', () => {
    const status = ethStatusFromFields(
      {
        td: '0x01',
        bestHash: '0x' + '11'.repeat(32),
        genesisHash: '0x' + '22'.repeat(32),
        latestBlock: '0x64',
        earliestBlock: '0x32',
      },
      68,
    )
    assert.equal(status.earliestBlock, undefined)
  })
})
