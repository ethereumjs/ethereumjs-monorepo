import { DPT } from '@ethereumjs/devp2p'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Config } from '../../../src/index.ts'
import { PeerPool } from '../../../src/net/peerpool.ts'
import { RlpxServer } from '../../../src/net/server/index.ts'
import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'admin_addPeer'
const localEndpointInfo = { address: '0.0.0.0', tcpPort: 30303 }
const peerPort = 30304

// NOTE: the `privateKey` currently cannot be 0x-prefixed in `./net/server/server.ts`
const privateKey = 'dc6457099f127cf0bac78de8b297df04951281909db4f58b43def7c7151e765d'
const privateKeyBytes = hexToBytes(`0x${privateKey}`)

describe(method, () => {
  it('works', async () => {
    const localPeerClient = await createClient({ opened: true, noPeers: true })
    const remotePeerClient = await createClient({ opened: true, noPeers: true })
    const rpc = getRPCClient(startRPC(createManager(localPeerClient).getMethods()))
    const dpt = new DPT(privateKeyBytes, {
      endpoint: localEndpointInfo,
    })

    localPeerClient.service.pool = new PeerPool({
      config: new Config({ accountCache: 10000, storageCache: 1000 }),
    })
    //@ts-expect-error -- Assigning to a read-only property
    localPeerClient.service.pool.config.server.dpt = dpt

    const remoteConfig = new Config({ accountCache: 10000, storageCache: 1000, port: peerPort })
    const remoteServer = new RlpxServer({
      config: remoteConfig,
      key: privateKey,
    })
    await remoteServer.start()
    ;(remotePeerClient.service.pool.config as any) = {
      server: remoteServer,
    }

    const addPeerResponse = await rpc.request('admin_addPeer', [
      { address: '0.0.0.0', tcpPort: peerPort, udpPort: peerPort },
    ])
    assert.equal(addPeerResponse.result, true, 'admin_addPeer successfully adds peer')

    const peersResponse = await rpc.request('admin_peers', [])
    assert.equal(peersResponse.result.length, 1, 'added peer is visible')
    assert.equal(localPeerClient.service.pool.peers.length, 1, 'added peer is visible in peer pool')
  })
})
