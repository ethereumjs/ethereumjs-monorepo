import { assert, describe, it } from 'vitest'

import { Common, Hardfork, Mainnet } from '../src/index.ts'

describe('[Common/BPO]: blob gas parameters', () => {
  it('param() returns correct BPO values', () => {
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

  it('getBlobGasSchedule() uses pre-BPO param names before Bpo1', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
    common.updateParams({
      4844: {
        targetBlobGasPerBlock: 393216,
        maxBlobGasPerBlock: 786432,
        blobGasPriceUpdateFraction: 3338477,
      },
    })
    const schedule = common.getBlobGasSchedule()
    assert.strictEqual(schedule.targetBlobGasPerBlock, 393216n)
    assert.strictEqual(schedule.maxBlobGasPerBlock, 786432n)
    assert.strictEqual(schedule.blobGasPriceUpdateFraction, 3338477n)
  })

  it('getBlobGasSchedule() uses BPO param names from Bpo1 onward', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Bpo1 })
    common.updateParams({
      4844: {
        blobGasPerBlob: 131072,
      },
    })
    const schedule = common.getBlobGasSchedule()
    assert.strictEqual(schedule.targetBlobGasPerBlock, common.param('target') * 131072n)
    assert.strictEqual(schedule.maxBlobGasPerBlock, common.param('max') * 131072n)
    assert.strictEqual(
      schedule.blobGasPriceUpdateFraction,
      common.param('blobGasPriceUpdateFraction'),
    )
  })
})
