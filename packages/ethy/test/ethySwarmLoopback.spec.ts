import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createBlockHeader } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import {
  EthMessageCodes,
  EthyChunkStore,
  EthyMessageCodeNames,
  EthyMessageCodes,
  RollingBlockStore,
  createThreadedNetwork,
  genPrivateKey,
  pk2id,
  tryServeEthyGet,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, bytesToUnprefixedHex } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { encodeBlockHeadersReply, startPeerCoordinator } from '../src/net/peerCoordinator.ts'
import { peerIdToBytes } from '../src/net/pivotHeader.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { seedDemoEthyPivot } from '../src/sync/seedDemoState.ts'

const MAINNET_STATUS_JSON = {
  td: '0x040000000000',
  bestHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  genesisHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
} as const

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

describe('[Ethy/Net]: ETHY/0 swarm loopback', () => {
  it('syncs seeded demo state over ETHY/0 with proof verification', async () => {
    const common = new Common({ chain: Mainnet, hardfork: 'paris' })
    const seederDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-seed-'))
    const joinerDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-join-'))
    const seed = await seedDemoEthyPivot({
      dataDir: seederDir,
      network: 'mainnet',
      chainId: 1n,
    })
    const pivotBlock = seed.pivotBlock
    const header = createBlockHeader(
      {
        number: pivotBlock,
        parentHash: new Uint8Array(32),
        stateRoot: seed.stateRoot,
        gasLimit: 30_000_000n,
        timestamp: 1_650_000_000n,
        difficulty: 0n,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const headHash = bytesToHex(header.hash())
    const status = {
      ...MAINNET_STATUS_JSON,
      bestHash: headHash,
      latestBlock: `0x${pivotBlock.toString(16)}`,
    }

    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 31200

    const seederChunks = new EthyChunkStore()
    seederChunks.setPivotAccountsDir(seed.accountsDir)

    const seeder = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyB,
      chain: 'mainnet',
      maxPeers: 4,
      capabilities: ['eth71', 'ethy0'],
      endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
      listenPort: BASE + 1,
      status,
      goodCitizen: false,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })
    seeder.setEthyStatus({
      basePivotBlock: pivotBlock.toString(),
      basePivotStateRoot: bytesToUnprefixedHex(seed.stateRoot),
      bucketsBitmask: '0xffff',
      balEarliestBlock: pivotBlock.toString(),
      balLatestBlock: pivotBlock.toString(),
    })

    seeder.events.on('protocol', (msg) => {
      const peer = peerIdToBytes(msg.peerId)
      if (msg.protocol === 'eth' && msg.code === EthMessageCodes.GET_BLOCK_HEADERS) {
        const reply = encodeBlockHeadersReply(71, header.serialize())
        seeder.sendEthMessage(peer, EthMessageCodes.BLOCK_HEADERS, reply)
        return
      }
      if (msg.protocol !== 'ethy') return
      const name = EthyMessageCodeNames[msg.code as EthyMessageCodes]
      if (!name.startsWith('GET_')) return
      const served = tryServeEthyGet(
        seederChunks,
        new RollingBlockStore(),
        [],
        idB,
        peer,
        name,
        RLP.decode(msg.payload),
      )
      if (served === undefined) return
      seeder.sendEthyMessage(peer, served.code, RLP.encode(served.rlp as never))
    })

    const spine = createSpine('mainnet', 1n)
    const snapStore = SnapPivotStore.open({
      dataDir: joinerDir,
      network: 'mainnet',
      chainId: 1n,
      genesisHash: networkGenesisHash('mainnet'),
      enabled: true,
    })
    let handle: Awaited<ReturnType<typeof startPeerCoordinator>> | undefined
    try {
      handle = await startPeerCoordinator({
        spine,
        stateManager: createFlatStateManager(),
        network: 'mainnet',
        inProcess: true,
        fresh: true,
        snapStore,
        shouldFindNeighbours: false,
        goodCitizen: true,
        listenPort: BASE,
        dial: {
          id: idB,
          address: '127.0.0.1',
          udpPort: BASE + 1,
          tcpPort: BASE + 1,
        },
      })

      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(
          () =>
            reject(
              new Error(
                `timeout (accounts=${spine.totalAccountsSynced} pivot=${String(spine.pivotBlockNumber)} transport=${spine.syncTransport} bucketsDone=${spine.snapBuckets.filter((b) => b.status === 'done').length})`,
              ),
            ),
          45_000,
        )
        const tick = setInterval(() => {
          const bucketsDone = spine.snapBuckets.every((b) => b.status === 'done')
          if (
            spine.syncTransport === 'ethy' &&
            spine.totalAccountsSynced >= seed.accountCount &&
            bucketsDone
          ) {
            clearTimeout(timer)
            clearInterval(tick)
            resolve()
          }
        }, 50)
      })

      assert.equal(spine.syncTransport, 'ethy')
      assert.isAtLeast(spine.totalAccountsSynced, seed.accountCount)
      assert.isTrue(spine.snapBuckets.every((b) => b.status === 'done'))
      const ethyDiagMessages = spine.diagnosticRingBuffer
        .filter((d) => d.subsystem === 'ethy')
        .map((d) => d.message)
      assert.isTrue(ethyDiagMessages.some((m) => m.includes('ETHY STATUS in:')))
      assert.isTrue(ethyDiagMessages.some((m) => m.includes('ETHY swarm sync started')))
      assert.isTrue(ethyDiagMessages.some((m) => m.includes('ETHY manifests received:')))
      assert.isTrue(ethyDiagMessages.some((m) => m.includes('ETHY accounts pass complete')))
    } finally {
      handle?.stop()
      seeder.stop()
    }
  }, 60_000)
})
