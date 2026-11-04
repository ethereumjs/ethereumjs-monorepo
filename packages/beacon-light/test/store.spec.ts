import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Common, Hoodi } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { createBeaconLightClient } from '../src/client.ts'
import { BeaconLightStore } from '../src/store.ts'

import { buildBootstrap } from './fixtures/syntheticCommittee.ts'

describe('[BeaconLight]: BeaconLightStore', () => {
  it('persists and resumes client state without re-bootstrap', () => {
    const dir = mkdtempSync(join(tmpdir(), 'beacon-light-store-'))
    const file = join(dir, 'light-client.json')
    const common = new Common({ chain: Hoodi })
    const bootstrap = buildBootstrap(9000)
    const client1 = createBeaconLightClient({ common })
    client1.bootstrap(bootstrap)
    const head1 = client1.getHeadExecution()
    const store = new BeaconLightStore(file)
    store.save(client1.exportState())

    const client2 = createBeaconLightClient({ common })
    const loaded = store.load()
    assert.ok(loaded !== undefined)
    client2.importState(loaded!)
    assert.ok(client2.isBootstrapped())
    assert.equal(client2.getHeadExecution()?.blockNumber, head1?.blockNumber)

    rmSync(dir, { recursive: true, force: true })
  })
})
