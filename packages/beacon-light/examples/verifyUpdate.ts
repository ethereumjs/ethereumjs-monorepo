import { Common, Mainnet } from '@ethereumjs/common'

import { createBeaconLightClient } from '../src/index.ts'

import { buildBootstrap } from '../test/fixtures/syntheticCommittee.ts'

const common = new Common({ chain: Mainnet })
const client = createBeaconLightClient({ common })
const bootstrap = buildBootstrap(6_500_000, Mainnet)
client.bootstrap(bootstrap)
const head = client.getHeadExecution()
console.log(
  `Verified execution block hash (demo): 0x${Buffer.from(head?.blockHash ?? new Uint8Array(32)).toString('hex')}`,
)
