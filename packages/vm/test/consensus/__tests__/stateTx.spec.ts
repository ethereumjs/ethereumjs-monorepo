import assert from 'node:assert/strict'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { describe, it } from 'vitest'

import { fixtureHasSignature, makeStateTestTx } from '../cases/stateTx.ts'

describe('[VM/consensus]: state test tx', () => {
  it('fixtureHasSignature() is true when v, r, and s are non-empty', () => {
    assert.ok(
      fixtureHasSignature({
        v: '0x1c',
        r: '0x01',
        s: '0x02',
      }),
    )
  })

  it('fixtureHasSignature() is false when signature fields are missing', () => {
    assert.ok(!fixtureHasSignature({ secretKey: '0x11' }))
    assert.ok(!fixtureHasSignature({ v: '0x1c' }))
  })

  it('makeStateTestTx() uses post txbytes for expectException entries', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka })
    const txbytes =
      '0xf861800a840100000094f89a03b42ea1412874da2cf1ae48956f73d06039018027a0b10bbb1ed080a26a866e80656874b633fbc34aa4a61e96434b387ca4be6ecce3a00b0700ce8087ed706466c9a5f65e9daf4781023a20bda97f3ea57953a74f96ad'
    assert.throws(
      () =>
        makeStateTestTx(
          {
            chainId: '0x02',
            secretKey: '0x1ad604b3d94e06ec50b27732ec677f3d857c4d588f082f0016317697dd3a2d92',
          },
          { common },
          'TransactionException.INVALID_CHAINID',
          txbytes,
        ),
      /Incompatible EIP155-based V/,
    )
  })
})
