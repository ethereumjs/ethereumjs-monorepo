import { assert, describe, it } from 'vitest'

import { Common, Hardfork, Mainnet } from '../src/index.ts'

describe('BPO', () => {
  it('should get the correct BPO values', () => {
    let common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Bpo1,
    })
    let target = common.param('target')
    let blobGasPriceUpdateFraction = common.param('blobGasPriceUpdateFraction')
    assert.deepStrictEqual(target, 10n)
    assert.deepStrictEqual(blobGasPriceUpdateFraction, 8346193n)

    common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Bpo2,
    })
    target = common.param('target')
    blobGasPriceUpdateFraction = common.param('blobGasPriceUpdateFraction')
    assert.deepStrictEqual(target, 14n)
    assert.deepStrictEqual(blobGasPriceUpdateFraction, 11684671n)
  })
})
