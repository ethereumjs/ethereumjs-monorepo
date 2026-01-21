import { DPT } from '@ethereumjs/devp2p'
import { assert, describe, it } from 'vitest'

import { SIGNER_A } from '@ethereumjs/testdata'
import { Config } from '../../../src/index.ts'
import { PeerPool } from '../../../src/net/peerpool.ts'
import { RlpxServer } from '../../../src/net/server/index.ts'
import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'admin_addPeer'
const localEndpointInfo = { address: '0.0.0.0', tcpPort: 30303 }
const peerPort = 30304

describe(method, () => {
  it('works', async () => {
    const localPeerClient = await createClient({ opened: true, noPeers: true })
    const remotePeerClient = await createClient({ opened: true, noPeers: true })
    const rpc = getRPCClient(startRPC(createManager(localPeerClient).getMethods()))
    const dpt = new DPT(SIGNER_A.privateKey, {
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
      key: SIGNER_A.privateKey,
    })
    await remoteServer.start()
    ;(remotePeerClient.service.pool.config as any) = {
      server: remoteServer,
    }

    const addPeerResponse = await rpc.request('admin_addPeer', [
      { address: '0.0.0.0', tcpPort: peerPort, udpPort: peerPort },
    ])
    assert.strictEqual(addPeerResponse.result, true, 'admin_addPeer successfully adds peer')

    const peersResponse = await rpc.request('admin_peers', [])
    assert.strictEqual(peersResponse.result.length, 1, 'added peer is visible')
    assert.strictEqual(
      localPeerClient.service.pool.peers.length,
      1,
      'added peer is visible in peer pool',
    )
  })
})
