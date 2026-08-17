import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { TransactionType, createTx, paramsTx } from '../src/index.ts'

import { blobTxDefaults, eoaCodeTxDefaults, stubKzg } from './txTypeMatrix.ts'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Osaka,
  params: paramsTx,
  customCrypto: { kzg: stubKzg },
})

const maxTransactionGasLimit = common.param('maxTransactionGasLimit')

const txTypes = [
  { type: TransactionType.Legacy, txData: {} },
  { type: TransactionType.AccessListEIP2930, txData: {} },
  { type: TransactionType.FeeMarketEIP1559, txData: {} },
  { type: TransactionType.BlobEIP4844, txData: blobTxDefaults },
  { type: TransactionType.EOACodeEIP7702, txData: eoaCodeTxDefaults },
]

describe('[EIP-7825]', () => {
  it(`Should continue to use 0 gas limit default for Osaka tx`, () => {
    for (const txType of txTypes) {
      const tx = createTx({ type: txType.type, ...txType.txData }, { common })
      assert.strictEqual(tx.gasLimit, BigInt(0))
    }
  })

  it(`Should not throw for gas limit on cap`, () => {
    for (const txType of txTypes) {
      assert.doesNotThrow(() =>
        createTx(
          { gasLimit: maxTransactionGasLimit, type: txType.type, ...txType.txData },
          { common },
        ),
      )
    }
  })

  it(`Should throw for gas limit over cap`, () => {
    for (const txType of txTypes) {
      assert.throws(() =>
        createTx(
          { gasLimit: maxTransactionGasLimit + BigInt(1), type: txType.type, ...txType.txData },
          { common },
        ),
      )
    }
  })
})
