import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEOACode7702Tx } from '../src/index.js'

import type { TxData } from '../src/7702/tx.js'
import type { AuthorizationListItem } from '../src/index.js'
import type { PrefixedHexString } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const addr = createAddressFromPrivateKey(pkey)

const ones32 = `0x${'01'.repeat(32)}` as PrefixedHexString

function getTxData(override: Partial<AuthorizationListItem> = {}): TxData {
  const validAuthorizationList: AuthorizationListItem = {
    chainId: '0x',
    address: `0x${'20'.repeat(20)}`,
    nonce: ['0x1'],
    yParity: '0x1',
    r: ones32,
    s: ones32,
  }

  return {
    authorizationList: [
      {
        ...validAuthorizationList,
        ...override,
      },
    ],
  }
}

describe('[EOACode7702Transaction]', () => {
  it('sign()', () => {
    const txn = createEOACode7702Tx(
      {
        value: 1,
        maxFeePerGas: 1,
        maxPriorityFeePerGas: 1,
        accessList: [],
        authorizationList: [],
        chainId: 1,
        gasLimit: 100000,
        to: createZeroAddress(),
        data: new Uint8Array(1),
      },
      { common },
    )
    const signed = txn.sign(pkey)
    assert.ok(signed.getSenderAddress().equals(addr))
    const txnSigned = txn.addSignature(signed.v!, signed.r!, signed.s!)
    assert.deepEqual(signed.toJSON(), txnSigned.toJSON())
  })

  it('valid and invalid authorizationList values', () => {
    const tests: [Partial<AuthorizationListItem>, string][] = [
      [
        {
          address: `0x${'20'.repeat(21)}`,
        },
        'address length should be 20 bytes',
      ],
      [
        {
          nonce: ['0x1', '0x2'],
        },
        'nonce list should consist of at most 1 item',
      ],
      [{ s: undefined as never }, 's is not defined'],
      [{ r: undefined as never }, 'r is not defined'],
      [{ yParity: undefined as never }, 'yParity is not defined'],
      [{ nonce: undefined as never }, 'nonce is not defined'],
      [{ address: undefined as never }, 'address is not defined'],
      [{ chainId: undefined as never }, 'chainId is not defined'],
    ]

    for (const test of tests) {
      const txData = getTxData(test[0])
      const testName = test[1]
      assert.throws(() => {
        createEOACode7702Tx(txData, { common }), testName
      })
    }

    assert.doesNotThrow(() => {
      createEOACode7702Tx(getTxData(), { common })
    })
  })
})
