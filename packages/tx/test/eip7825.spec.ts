import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { TransactionType, createTx, paramsTx } from '../src/index.ts'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Osaka,
  params: paramsTx,
})

const maxTransactionGasLimit = common.param('maxTransactionGasLimit')

const txTypes = [
  TransactionType.Legacy,
  TransactionType.AccessListEIP2930,
  TransactionType.FeeMarketEIP1559,
  // Do not test 4844 + 7702 txs to keep test setup simple +
  // no specific logic touched
]

describe('[EIP-7825 tests]', () => {
  it(`Should continue to use 0 gas limit default for Osaka tx`, () => {
    for (const txType of txTypes) {
      const tx = createTx({ type: txType }, { common })
      assert.strictEqual(tx.gasLimit, BigInt(0))
    }
  })

  it(`Should not throw for gas limit on cap`, () => {
    for (const txType of txTypes) {
      assert.doesNotThrow(() =>
        createTx({ gasLimit: maxTransactionGasLimit, type: txType }, { common }),
      )
    }
  })

  it(`Should throw for gas limit over cap`, () => {
    for (const txType of txTypes) {
      assert.throws(() =>
        createTx({ gasLimit: maxTransactionGasLimit + BigInt(1), type: txType }, { common }),
      )
    }
  })
})
