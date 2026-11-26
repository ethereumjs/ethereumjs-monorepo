import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../../src/index.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import { pk2id } from '../../src/util.ts'
import type { WorkerTelemetrySnapshot } from '../../src/worker/protocol.ts'

const workerModuleUrl = resolveThreadedNetworkModuleUrl(import.meta.url)

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

function waitTelemetry(
  client: Awaited<ReturnType<typeof createThreadedNetwork>>,
  pred: (s: WorkerTelemetrySnapshot) => boolean,
  ms = 20000,
): Promise<WorkerTelemetrySnapshot> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('telemetry timeout')), ms)
    const onTelemetry = (snap: WorkerTelemetrySnapshot) => {
      if (!pred(snap)) return
      clearTimeout(timer)
      client.events.off('telemetry', onTelemetry)
      resolve(snap)
    }
    client.events.on('telemetry', onTelemetry)
  })
}

describe('[DevP2P/Worker]: ETHY/0 custody swarm', () => {
  it('negotiates trieBucketsBitmask on remote ETHY STATUS', async () => {
    const keyA = genPrivateKey()
    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 33800
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x0' }

    const server = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyB,
        chain: 'mainnet',
        maxPeers: 4,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
        listenPort: BASE + 1,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )
    server.setEthyStatus({
      bucketsBitmask: '255',
      trieBucketsBitmask: '15',
      basePivotBlock: '100',
    })

    const client = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: keyA,
        chain: 'mainnet',
        maxPeers: 4,
        capabilities: ['eth71', 'ethy0'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )
    client.setEthyStatus({ bucketsBitmask: '240', trieBucketsBitmask: '240' })
    client.connectPeer({ id: idB, address: '127.0.0.1', tcpPort: BASE + 1, udpPort: BASE + 1 })

    const snap = await waitTelemetry(client, (s) => {
      const p = s.peers.find((row) => row.ethySession === true && row.ethyStatus !== undefined)
      return p !== undefined
    })
    const peer = snap.peers.find((p) => p.ethyStatus !== undefined)
    assert.equal(peer?.ethyStatus?.bucketsBitmask, '255')
    assert.equal(peer?.ethyStatus?.trieBucketsBitmask, '15')

    client.stop()
    server.stop()
  })
})
