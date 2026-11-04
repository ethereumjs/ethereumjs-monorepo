import { assert, describe, it } from 'vitest'

import { Common, Hoodi } from '@ethereumjs/common'
import { parseBeaconLightArgs } from '../src/cli/args.ts'
import { createBeaconLightClient } from '../src/client.ts'

import { buildBootstrap } from './fixtures/syntheticCommittee.ts'

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
})
