import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import {
  computeIntrinsicGasDimensions8037,
  txExceedsAvailableBlockGas8037,
} from '../src/eip8037.ts'

describe('[EVM/EIP8037]: state gas helpers', () => {
  it('computeIntrinsicGasDimensions8037() returns zero state gas without EIP-8037', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
    const tx = {
      type: 0,
      common,
      value: 0n,
      getIntrinsicGas: () => 21000n,
      toCreationAddress: () => false,
    }
    const dims = computeIntrinsicGasDimensions8037(common, tx)
    assert.strictEqual(dims.intrinsicRegular, 21000n)
    assert.strictEqual(dims.intrinsicState, 0n)
  })

  it('computeIntrinsicGasDimensions8037() exposes regular intrinsic gas when EIP-8037 is active', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const tx = {
      type: 0,
      common,
      value: 0n,
      getIntrinsicGas: () => 25000n,
      toCreationAddress: () => false,
    }
    const dims = computeIntrinsicGasDimensions8037(common, tx, 30_000_000n)
    assert.strictEqual(dims.intrinsicRegular, 25000n)
    assert.strictEqual(dims.intrinsicState, 0n)
  })

  it('txExceedsAvailableBlockGas8037() accepts when both dimensions have room', () => {
    assert.isFalse(txExceedsAvailableBlockGas8037(300_000n, 16_777_216n, 400_000n, 0n, 0n))
  })

  it('txExceedsAvailableBlockGas8037() rejects when tx.gas exceeds remaining state gas', () => {
    assert.isTrue(
      txExceedsAvailableBlockGas8037(300_000n, 16_777_216n, 400_000n, 21_000n, 183_600n),
    )
  })

  it('txExceedsAvailableBlockGas8037() caps only the regular bound at TX_MAX', () => {
    const txMax = 16_777_216n
    const txGas = 20_000_000n
    assert.isFalse(txExceedsAvailableBlockGas8037(txGas, txMax, 30_000_000n, 0n, 0n))
    assert.isTrue(txExceedsAvailableBlockGas8037(txGas, txMax, 30_000_000n, 0n, 10_000_001n))
  })
})
