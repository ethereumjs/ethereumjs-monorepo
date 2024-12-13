import { randomBytes } from 'crypto'
import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.js'

const method = 'admin_peers'

describe(method, () => {
  it('works', async () => {
    const manager = createManager(await createClient({ opened: true, noPeers: true }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    //@ts-ignore
    manager['_client'].service.pool.peers = [
      {
        id: 'abcd',
        eth: {
          versions: ['68'],
          status: {
            td: 1n,
            bestHash: randomBytes(32),
          },
        },
        rlpxPeer: {
          _hello: {
            clientId: 'fakeClient',
          },
        },
        address: '127.0.0.1:8545',
      },
    ]
    const res = await rpc.request(method, [])
    const { result } = res
    assert.notEqual(result, undefined, 'admin_peers returns a value')
  })
})
