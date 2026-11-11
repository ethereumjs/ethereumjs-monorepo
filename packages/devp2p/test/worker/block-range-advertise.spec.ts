import { RLP } from '@ethereumjs/rlp'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  type Devp2pWorkerClient,
  createThreadedNetwork,
  genPrivateKey,
  resolveThreadedNetworkModuleUrl,
} from '../../src/index.ts'
import { MAINNET_STATUS_JSON } from '../../src/lab/inProcessMesh.ts'
import type { WorkerTelemetrySnapshot } from '../../src/worker/protocol.ts'

const workerModuleUrl = resolveThreadedNetworkModuleUrl(import.meta.url)

function putDemoBlocks(client: Devp2pWorkerClient, start: bigint, count: number) {
  let parent = new Uint8Array(32)
  for (let i = 0; i < count; i++) {
    const n = start + BigInt(i)
    const hash = new Uint8Array(32)
    hash[31] = Number(n)
    const headerRlp = RLP.encode([parent, new Uint8Array(32), new Uint8Array(20)])
    client.putServableBlock({
      number: n,
      hash,
      headerRlp,
      bodyRlp: RLP.encode([[], []]),
      receiptsEth69Rlp: RLP.encode([]),
    })
    parent = hash
  }
}

describe('[DevP2P/Worker]: BLOCK_RANGE_UPDATE advertise', () => {
  it('exposes a servable window in telemetry when advertise is enabled after blocks land', async () => {
    const key = genPrivateKey()
    const BASE = 32300
    const status = {
      ...MAINNET_STATUS_JSON,
      latestBlock: '0x64',
      earliestBlock: '0x64',
      bestHash: '0x' + '66'.repeat(32),
    }

    const server = await createThreadedNetwork(
      {
        inProcess: true,
        privateKey: key,
        chain: 'mainnet',
        maxPeers: 2,
        capabilities: ['eth71'],
        endpoint: { address: '127.0.0.1', udpPort: BASE, tcpPort: BASE },
        listenPort: BASE,
        status,
        goodCitizen: true,
        shouldFindNeighbours: false,
        throttleDiscovery: false,
      },
      workerModuleUrl,
    )

    putDemoBlocks(server, 600n, 5)

    server.setAdvertiseBlockRange(true)

    const snap = await new Promise<WorkerTelemetrySnapshot>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout telemetry')), 8000)
      server.events.on('telemetry', (telemetry) => {
        if (
          telemetry.serving.earliestBlock !== undefined &&
          telemetry.serving.latestBlock !== undefined
        ) {
          clearTimeout(timer)
          resolve(telemetry)
        }
      })
    })

    assert.equal(snap.serving.blocksStored, 5)
    assert.equal(snap.serving.earliestBlock, '600')
    assert.equal(snap.serving.latestBlock, '604')

    server.stop()
  }, 15_000)
})
