import { assert, describe, it } from 'vitest'

import { Common, Hoodi } from '@ethereumjs/common'
import { parseBeaconLightArgs } from '../src/cli/args.ts'
import { createBeaconLightClient } from '../src/client.ts'
import { LightClientRunner } from '../src/runner.ts'
import type { BeaconLightTransport } from '../src/transport.ts'

import {
  buildBootstrap,
  buildTestSyncCommittee,
  signAttestedHeader,
} from './fixtures/syntheticCommittee.ts'

describe('[BeaconLight]: CLI args and demo path', () => {
  it('parses network and flags', () => {
    const cli = parseBeaconLightArgs(['node', 'beacon-light', 'mainnet', '--once', '--demo'])
    assert.equal(cli.network, 'mainnet')
    assert.equal(cli.once, true)
    assert.equal(cli.demo, true)
  })

  it('demo bootstrap path produces execution head', () => {
    const common = new Common({ chain: Hoodi })
    const client = createBeaconLightClient({ common })
    client.bootstrap(buildBootstrap(12_000))
    assert.ok(client.getHeadExecution()?.blockNumber === 42)
  })

  it('LightClientRunner.pollOnce() re-bootstraps when stored snapshot is multiple sync committee periods behind', async () => {
    const common = new Common({ chain: Hoodi })
    const client = createBeaconLightClient({ common })
    // Bootstrap at slot 100_000 (period 12) with an empty nextSyncCommittee
    client.bootstrap(buildBootstrap(100_000))
    assert.equal(client.getHeadExecution()?.slot, 100_000)

    // Live chain is now 4 periods ahead at slot 135_000 (period 16)
    const liveBootSlot = 135_000
    const liveOptSlot = 135_010
    const liveSigSlot = 135_011
    const { secretKeys } = buildTestSyncCommittee()
    const liveOptHeader = buildBootstrap(liveOptSlot).header
    const indices = Array.from({ length: 342 }, (_, i) => i)
    const syncAggregate = signAttestedHeader(liveOptHeader, liveSigSlot, indices, secretKeys)

    const fakeTransport = {
      fetchOptimisticUpdate: async () => ({
        attestedHeader: liveOptHeader,
        syncAggregate,
        signatureSlot: liveSigSlot,
      }),
      fetchUpdates: async () => [],
      discoverBootstrapBlockRoot: async () => '0x' + '11'.repeat(32),
      fetchBootstrap: async () => buildBootstrap(liveBootSlot),
      fetchFinalityUpdate: async () => {
        throw new Error('skip finality')
      },
    } as unknown as BeaconLightTransport

    const runner = new LightClientRunner({
      common,
      client,
      transport: fakeTransport,
    })

    const res = await runner.pollOnce()
    assert.equal(res.optimisticApplied, true)
    assert.isUndefined(res.error)
    assert.equal(client.getHeadExecution()?.slot, liveOptSlot)
    assert.equal(client.getHeadExecution()?.blockNumber, 42)
  })
})
