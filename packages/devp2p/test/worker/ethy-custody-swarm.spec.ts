import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, equalsBytes, intToUnpaddedBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import {
  EthyMessageCodes,
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

function waitEthyProtocolMsg(
  client: Awaited<ReturnType<typeof createThreadedNetwork>>,
  expectedCode: number,
  ms = 15000,
): Promise<{ peerId: string; code: number; payload: Uint8Array }> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`timeout waiting for ethy code 0x${expectedCode.toString(16)}`)),
      ms,
    )
    const onProto = (ev: {
      protocol: 'eth' | 'snap' | 'ethy'
      peerId: string
      code: number
      payload: Uint8Array
    }) => {
      if (ev.protocol !== 'ethy' || ev.code !== expectedCode) return
      clearTimeout(timer)
      client.events.off('protocol', onProto)
      resolve(ev)
    }
    client.events.on('protocol', onProto)
  })
}

describe('[DevP2P/Worker]: ETHY/0 custody swarm', () => {
  it('3-node custody swarm: trieBucketsBitmask STATUS, bucket-aware PEX, targeted 0x03 chunk, 0x0b/0x0c witness, and 0x0d/0x0e subtree roots', async () => {
    const keyHub = genPrivateKey()
    const keyCustodian = genPrivateKey()
    const keyJoiner = genPrivateKey()
    const idHub = nodeIdFromPrivateKey(keyHub)
    const idCustodian = nodeIdFromPrivateKey(keyCustodian)
    const BASE = 33810
    const status = { ...MAINNET_STATUS_JSON, earliestBlock: '0x0', latestBlock: '0x0' }

    const makeNode = (key: Uint8Array, port: number) =>
      createThreadedNetwork(
        {
          inProcess: true,
          privateKey: key,
          chain: 'mainnet',
          maxPeers: 8,
          capabilities: ['eth71', 'ethy0'],
          endpoint: { address: '127.0.0.1', udpPort: port, tcpPort: port },
          listenPort: port,
          status,
          goodCitizen: true,
          shouldFindNeighbours: false,
          throttleDiscovery: false,
        },
        workerModuleUrl,
      )

    const hub = await makeNode(keyHub, BASE)
    const custodian = await makeNode(keyCustodian, BASE + 1)
    const joiner = await makeNode(keyJoiner, BASE + 2)

    try {
      // Hub serves bucket 0x0; Custodian serves bucket 0x2 with live subtree trie + chunk + witness + h_2
      hub.setEthyStatus({
        bucketsBitmask: '1',
        trieBucketsBitmask: '1',
        basePivotBlock: '100',
      })
      custodian.setEthyStatus({
        bucketsBitmask: '4', // bit 2 (bucket 0x2)
        trieBucketsBitmask: '4',
        basePivotBlock: '100',
      })

      const originHash = new Uint8Array(32)
      originHash[0] = 0x20
      const targetHash = new Uint8Array(32)
      targetHash[0] = 0x25
      const lastHash = new Uint8Array(32)
      lastHash[0] = 0x2f
      const slab = new Uint8Array(136)
      slab.set(originHash, 0)
      const rootHash = new Uint8Array(32).fill(0xab)

      custodian.putEthyAccountChunk({
        bucketIndex: 2,
        originHash,
        lastHash,
        hasRight: 0,
        chunkStateRoot: rootHash,
        chunkBlockNumber: 100n,
        binaryAccountsSlab: slab,
        proofNodes: [new Uint8Array([0xc1, 0x80])],
      })
      custodian.putEthyWitness({
        accountHash: targetHash,
        anchorBlock: 100n,
        anchorStateRoot: rootHash,
        accountRlpOrEmpty: new Uint8Array([0xc1, 0x05]),
        slots: [],
        proofNodes: [new Uint8Array([0xaa, 0xbb])],
      })
      const h2 = new Uint8Array(32).fill(0x22)
      custodian.putEthySubtreeRoots(100n, [{ bucketIndex: 2, subtreeRootHash: h2 }])

      // Step 1: Custodian connects to Hub so Hub learns Custodian in ETHY_PEX book
      custodian.connectPeer({
        id: idHub,
        address: '127.0.0.1',
        tcpPort: BASE,
        udpPort: BASE,
      })
      await waitTelemetry(hub, (s) =>
        s.peers.some(
          (p) => p.ethyStatus?.bucketsBitmask === '4' && p.ethyStatus.trieBucketsBitmask === '4',
        ),
      )

      // Step 2: Joiner (holding bucket 0x1, desiring bucket 0x2) connects ONLY to Hub
      joiner.setEthyStatus({ bucketsBitmask: '2', trieBucketsBitmask: '0', basePivotBlock: '100' })
      joiner.setNetworkProfile({
        capabilities: ['eth71', 'ethy0'],
        maxPeers: 8,
        minEthyPeers: 2,
        discoveryMode: 'off',
        ethyDiscoveryTag: false,
        desiredEthyBucketsMask: 4, // want bucket 0x2
      })
      joiner.connectPeer({
        id: idHub,
        address: '127.0.0.1',
        tcpPort: BASE,
        udpPort: BASE,
      })

      // Bucket-aware ETHY_PEX from Hub introduces Joiner to Custodian automatically!
      const joinerSnap = await waitTelemetry(joiner, (s) =>
        s.peers.some(
          (p) => p.ethyStatus?.bucketsBitmask === '4' && p.ethyStatus?.trieBucketsBitmask === '4',
        ),
      )
      assert.ok(
        joinerSnap.peers.some((p) => p.ethyStatus?.trieBucketsBitmask === '4'),
        'joiner discovered bucket-0x2 custodian via bucket-aware ETHY_PEX',
      )

      // Step 3: Targeted 0x03 single-key lookup (targetHash inside [originHash..lastHash])
      const chunkPromise = waitEthyProtocolMsg(joiner, EthyMessageCodes.PROVEN_ACCOUNT_CHUNK)
      joiner.sendEthyMessage(
        idCustodian,
        EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK,
        RLP.encode([bigIntToUnpaddedBytes(11n), intToUnpaddedBytes(2), targetHash]),
      )
      const chunkMsg = await chunkPromise
      const chunkDecoded = RLP.decode(chunkMsg.payload) as unknown[]
      assert.isTrue(equalsBytes(chunkDecoded[2] as Uint8Array, originHash))
      assert.isTrue(equalsBytes(chunkDecoded[7] as Uint8Array, slab))

      // Step 4: 0x0b GET_STATE_WITNESS -> 0x0c STATE_WITNESS (1-hop)
      const witnessPromise = waitEthyProtocolMsg(joiner, EthyMessageCodes.STATE_WITNESS)
      joiner.sendEthyMessage(
        idCustodian,
        EthyMessageCodes.GET_STATE_WITNESS,
        RLP.encode([
          bigIntToUnpaddedBytes(12n),
          bigIntToUnpaddedBytes(90n),
          intToUnpaddedBytes(524_288),
          [[targetHash, []]],
        ]),
      )
      const witnessMsg = await witnessPromise
      const witnessDecoded = RLP.decode(witnessMsg.payload) as unknown[]
      const groups = witnessDecoded[1] as unknown[][]
      assert.equal(groups.length, 1)
      const accts = groups[0]![2] as [Uint8Array, Uint8Array][]
      assert.isTrue(equalsBytes(accts[0]![0], targetHash))

      // Step 5: 0x0d GET_SUBTREE_ROOTS -> 0x0e SUBTREE_ROOTS
      const subtreePromise = waitEthyProtocolMsg(joiner, EthyMessageCodes.SUBTREE_ROOTS)
      joiner.sendEthyMessage(
        idCustodian,
        EthyMessageCodes.GET_SUBTREE_ROOTS,
        RLP.encode([
          bigIntToUnpaddedBytes(13n),
          bigIntToUnpaddedBytes(100n),
          intToUnpaddedBytes(4),
        ]),
      )
      const subtreeMsg = await subtreePromise
      const subtreeDecoded = RLP.decode(subtreeMsg.payload) as unknown[]
      const entries = subtreeDecoded[2] as [Uint8Array, Uint8Array][]
      assert.equal(entries.length, 1)
      assert.isTrue(equalsBytes(entries[0]![1], h2))
    } finally {
      joiner.stop()
      custodian.stop()
      hub.stop()
    }
  })
})
