import { assert, describe, it } from 'vitest'
import { Common, Holesky, Hoodi, Mainnet, Sepolia } from '../src/index.ts'

describe('[Common]: beacon light client config', () => {
  it('Mainnet exposes beacon metadata and Electra fork version', () => {
    const common = new Common({ chain: Mainnet })
    const cfg = common.beaconLightClient()
    assert.ok(cfg !== undefined)
    assert.equal(cfg!.genesisTime, 1606824023)
    assert.equal(common.forkVersionAtEpoch(364032), '0x05000000')
    assert.equal(common.syncCommitteePeriodAtSlot(0), 0)
    assert.equal(common.syncCommitteePeriodAtSlot(8192), 1)
  })

  it('Sepolia, Hoodi, and Holesky expose beacon metadata', () => {
    for (const chain of [Sepolia, Hoodi, Holesky]) {
      const common = new Common({ chain })
      assert.ok(common.beaconLightClient() !== undefined)
      assert.ok(common.beaconLightClient()!.defaultEndpoints.length >= 2)
    }
  })

  it('Hoodi epoch 0 resolves to Deneb fork version', () => {
    const common = new Common({ chain: Hoodi })
    assert.equal(common.forkVersionAtEpoch(0), '0x50000910')
  })

  it('fork schedule rows are sorted by epoch', () => {
    const common = new Common({ chain: Mainnet })
    const forks = common.beaconLightClient()!.forks
    for (let i = 1; i < forks.length; i++) {
      assert.ok(forks[i]!.epoch >= forks[i - 1]!.epoch)
    }
  })

  it('chains without beaconLightClient return undefined', () => {
    const common = new Common({
      chain: {
        ...Mainnet,
        beaconLightClient: undefined,
      },
    })
    assert.equal(common.beaconLightClient(), undefined)
  })
})
