import { assert, describe, it } from 'vitest'

import {
  create1559FeeMarketTxFromBytesArray,
  createFeeMarket1559Tx,
  createFeeMarket1559TxFromBytesArray,
} from '../src/index.ts'

// D-NAME-1: the canonical `createFeeMarket1559TxFromBytesArray` and the legacy
// (deprecated) `create1559FeeMarketTxFromBytesArray` must produce identical transactions.
describe('API conventions: FeeMarket1559Tx bytes-array factory alias (D-NAME-1)', () => {
  it('canonical and deprecated bytes-array factories produce identical txs', () => {
    const values = createFeeMarket1559Tx({
      chainId: 1n,
      nonce: 1n,
      maxPriorityFeePerGas: 10n,
      maxFeePerGas: 100n,
      gasLimit: 21000n,
      value: 1n,
    }).raw()

    const canonical = createFeeMarket1559TxFromBytesArray(values)
    const legacy = create1559FeeMarketTxFromBytesArray(values)

    assert.deepEqual(
      canonical.serialize(),
      legacy.serialize(),
      'both factories serialize to identical bytes',
    )
  })
})
