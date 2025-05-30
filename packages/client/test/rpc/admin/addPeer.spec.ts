import { assert, describe, it } from 'vitest'

import { Config, SyncMode } from '../../../src/index.ts'
import { PeerPool } from '../../../src/net/peerpool.ts'
import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'admin_addPeer'
const peerPort = 30304

describe(method, () => {
  it('works', async () => {
    const localPeerClient = await createClient({ opened: true, noPeers: true })
    const rpc = getRPCClient(startRPC(createManager(localPeerClient).getMethods()))

    const localConfig = new Config({
      accountCache: 10000,
      storageCache: 1000,
      logger: {
        info: (msg: string) => console.log(`[LOCAL] [INFO] ${msg}`),
        warn: (msg: string) => console.warn(`[LOCAL] [WARN] ${msg}`),
        error: (msg: string) => console.error(`[LOCAL] [ERROR] ${msg}`),
        debug: (msg: string) => console.debug(`[LOCAL] [DEBUG] ${msg}`),
      },
      syncmode: SyncMode.Full,
    })
    localPeerClient.service.pool = new PeerPool({
      config: localConfig,
    })

    const remoteConfig = new Config({
      accountCache: 10000,
      storageCache: 1000,
      port: peerPort,
      syncmode: SyncMode.Full,
      logger: {
        info: (msg: string) => console.log(`[REMOTE] [INFO] ${msg}`),
        warn: (msg: string) => console.warn(`[REMOTE] [WARN] ${msg}`),
        error: (msg: string) => console.error(`[REMOTE] [ERROR] ${msg}`),
        debug: (msg: string) => console.debug(`[REMOTE] [DEBUG] ${msg}`),
      },
    })

    await remoteConfig.networkWorker!.start(remoteConfig, [], [])

    await new Promise((resolve) => setTimeout(resolve, 1000))
    const addPeerResponse = await rpc.request('admin_addPeer', [
      { address: '0.0.0.0', tcpPort: peerPort, udpPort: peerPort },
    ])
    assert.strictEqual(addPeerResponse.result, true, 'admin_addPeer successfully adds peer')

    const peersResponse = await rpc.request('admin_peers', [])
    assert.strictEqual(peersResponse.result.length, 1, 'admin_peers returns one peer')
  })
}, 10000)
