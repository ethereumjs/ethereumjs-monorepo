import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createLegacyTx, getCalldataFloorGas, getEip2780RecipientRegularGas } from '../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)
const recipient = createZeroAddress()

describe('EIP-2780 intrinsic / calldata floor (Amsterdam)', () => {
  it('getIntrinsicGas includes recipient/value extras for a signed call', () => {
    const tx = createLegacyTx(
      { to: recipient, value: 1n, gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey)

    const expected =
      tx.common.param('txGas') +
      tx.common.param('txRecipientAccessGas') +
      tx.common.param('txValueCost')
    assert.strictEqual(tx.getIntrinsicGas(), expected)
    assert.strictEqual(getEip2780RecipientRegularGas(tx), expected - tx.common.param('txGas'))
  })

  it('self-transfer skips recipient extras', () => {
    const tx = createLegacyTx(
      { to: sender, value: 1n, gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey)
    assert.strictEqual(tx.getIntrinsicGas(), tx.common.param('txGas'))
    assert.strictEqual(getEip2780RecipientRegularGas(tx), 0n)
  })

  it('value-bearing create charges TX_VALUE_COST (v8 fold)', () => {
    const tx = createLegacyTx({ value: 1n, gasLimit: 100_000n, gasPrice: 10n }, { common }).sign(
      senderKey,
    )
    const valueExtra = tx.common.param('txValueCost')
    assert.strictEqual(getEip2780RecipientRegularGas(tx), valueExtra)
    assert.strictEqual(
      tx.getIntrinsicGas(),
      tx.common.param('txGas') + tx.common.param('txCreationGas') + valueExtra,
    )
  })

  it('calldata floor uses TX_BASE + recipient extras', () => {
    const data = new Uint8Array(10).fill(1)
    const tx = createLegacyTx(
      { to: recipient, data, gasLimit: 100_000n, gasPrice: 10n },
      { common },
    )
    const extras = tx.common.param('txRecipientAccessGas') // unsigned → not treated as self-transfer
    const expected =
      tx.common.param('txGas') +
      extras +
      tx.common.param('totalCostFloorPerToken') * BigInt(data.length) * 4n
    assert.strictEqual(getCalldataFloorGas(tx), expected)
  })
})
