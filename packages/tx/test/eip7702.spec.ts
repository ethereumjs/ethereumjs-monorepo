import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  BIGINT_1,
  MAX_INTEGER,
  MAX_UINT64,
  bigIntToHex,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEOACode7702Tx } from '../src/index.ts'

import type { EOACode7702AuthorizationListItem, PrefixedHexString } from '@ethereumjs/util'
import type { TxData } from '../src/7702/tx.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const addr = createAddressFromPrivateKey(pkey)

const ones32: PrefixedHexString = `0x${'01'.repeat(32)}`

function getTxData(override: Partial<EOACode7702AuthorizationListItem> = {}): TxData {
  const validAuthorizationList: EOACode7702AuthorizationListItem = {
    chainId: '0x',
    address: `0x${'20'.repeat(20)}`,
    nonce: '0x1',
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
    to: createZeroAddress(),
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
        ...getTxData(),
        chainId: 1,
        gasLimit: 100000,
        to: createZeroAddress(),
        data: new Uint8Array(1),
      },
      { common },
    )
    const signed = txn.sign(pkey)
    assert.isTrue(signed.getSenderAddress().equals(addr))
    const txnSigned = txn.addSignature(signed.v!, signed.r!, signed.s!)
    assert.deepEqual(signed.toJSON(), txnSigned.toJSON())
    assert.throws(() => {
      txn.toCreationAddress()
    }, 'EOACode7702Tx cannot create contracts')
    // Verify 1000 signatures to ensure these have unique hashes (hedged signatures test)
    const hashSet = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const hash = bytesToHex(txn.sign(pkey, true).hash())
      if (hashSet.has(hash)) {
        assert.fail('should not reuse the same hash (hedged signature test)')
      }
      hashSet.add(hash)
    }
  })

  it('valid and invalid authorizationList values', () => {
    const tests: [Partial<EOACode7702AuthorizationListItem>, string][] = [
      [
        {
          address: `0x${'20'.repeat(21)}`,
        },
        'address length should be 20 bytes',
      ],
      [{ s: undefined as never }, 's is not defined'],
      [{ r: undefined as never }, 'r is not defined'],
      [{ yParity: undefined as never }, 'yParity is not defined'],
      [{ nonce: undefined as never }, 'nonce is not defined'],
      [{ address: undefined as never }, 'address is not defined'],
      [{ chainId: undefined as never }, 'chainId is not defined'],
      [{ chainId: bigIntToHex(MAX_INTEGER + BIGINT_1) }, 'chainId exceeds 2^256 - 1'],
      [
        { nonce: bigIntToHex(MAX_UINT64 + BIGINT_1) },
        'Invalid EIP-7702 transaction: nonce exceeds 2^64 - 1',
      ],
      [{ yParity: '0x0100' }, 'yParity should be < 2^8'],
      [{ r: bigIntToHex(MAX_INTEGER + BIGINT_1) }, 'r exceeds 2^256 - 1'],
      [{ s: bigIntToHex(MAX_INTEGER + BIGINT_1) }, 's exceeds 2^256 - 1'],
      [{ yParity: '0x0002' }, 'yParity cannot have leading zeros'],
      [{ r: '0x0001' }, 'r cannot have leading zeros'],
      [{ s: '0x0001' }, 's cannot have leading zeros'],
      [{ nonce: '0x0001' }, 'nonce cannot have leading zeros'],
      [{ chainId: '0x0001' }, 'chainId cannot have leading zeros'],
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
