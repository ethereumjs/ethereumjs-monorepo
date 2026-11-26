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
  EthyStorageStore,
  EthySubtreeRootBook,
  EthyWitnessStore,
  RollingBlockStore,
  SharedCodeDisk,
  createThreadedNetwork,
  genPrivateKey,
  pk2id,
  tryServeEthyGet,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, bytesToUnprefixedHex, hexToBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

import { loadOrAssignCustody } from '../src/custody/custodyPlan.ts'
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

describe('[Ethy/Net]: custody zero-snap ETHY loopback', () => {
  it('syncs assigned custody buckets without snap/1 bootstrap', async () => {
    const common = new Common({ chain: Mainnet, hardfork: 'paris' })
    const seederDir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-seed-'))
    const joinerDir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-join-'))
    const joinerKey = hexToBytes(`0x${'11'.repeat(32)}`)
    fs.mkdirSync(joinerDir, { recursive: true })
    fs.writeFileSync(path.join(joinerDir, 'node-key.txt'), `${bytesToUnprefixedHex(joinerKey)}\n`, {
      mode: 0o600,
    })
    const custody = loadOrAssignCustody(undefined, joinerKey, 2)

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
    const BASE = 34100

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
      codeBucketsBitmask: '0xffff',
      storageBucketsBitmask: '0xffff',
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
        new SharedCodeDisk(),
        new EthyStorageStore(),
        {
          witnessStore: new EthyWitnessStore(),
          subtreeBook: new EthySubtreeRootBook(),
          remoteBucketsBitmask: 0xffff,
          witnessThrottle: { windowStartMs: 0, count: 0 },
        },
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
        dataDir: joinerDir,
        inProcess: true,
        fresh: true,
        snapStore,
        shouldFindNeighbours: false,
        goodCitizen: true,
        listenPort: BASE,
        snapBootstrap: false,
        custodyCount: 2,
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
                `custody timeout phase=${spine.phase} bg=${spine.custodyBackgroundActive} pivot=${String(spine.pivotBlockNumber)} buckets=${JSON.stringify(custody.buckets)}`,
              ),
            ),
          60_000,
        )
        const tick = setInterval(() => {
          const custodyDone = custody.buckets.every((b) => spine.snapBuckets[b]!.status === 'done')
          if (
            spine.phase === 'HEAD_FOLLOWING' &&
            spine.custodyBackgroundActive === true &&
            spine.custodyBuckets?.length === 2 &&
            custodyDone
          ) {
            clearTimeout(timer)
            clearInterval(tick)
            resolve()
          }
        }, 50)
      })

      assert.deepEqual(spine.custodyBuckets, custody.buckets)
      assert.isBelow(spine.snapBuckets.filter((b) => b.status === 'done').length, 16)
      assert.isTrue(
        spine.diagnosticRingBuffer.some((d) => d.message.includes('Custody background sync')),
      )
    } finally {
      handle?.stop()
      seeder.stop()
    }
  }, 75_000)
})
