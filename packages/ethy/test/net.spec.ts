import { createBlockHeader } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { EthMessageCodes, createThreadedNetwork, genPrivateKey, pk2id } from '@ethereumjs/devp2p'
import { bytesToHex } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { assert, describe, it } from 'vitest'

const MAINNET_STATUS_JSON = {
  td: '0x040000000000',
  bestHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
  genesisHash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
} as const
import { encodeBlockHeadersReply, startPeerCoordinator } from '../src/net/peerCoordinator.ts'
import { peerIdToBytes } from '../src/net/pivotHeader.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function nodeIdFromPrivateKey(privateKey: Uint8Array): Uint8Array {
  return pk2id(secp256k1.getPublicKey(privateKey, false))
}

describe('[Ethy/Net]: PeerCoordinator pivot', () => {
  it('acquires pivot stateRoot from in-process peer STATUS and BLOCK_HEADERS', async () => {
    const common = new Common({ chain: Mainnet, hardfork: 'paris' })
    const header = createBlockHeader(
      {
        number: 17_000_000n,
        parentHash: new Uint8Array(32),
        stateRoot: Uint8Array.from({ length: 32 }, (_, i) => i),
        gasLimit: 30_000_000n,
        timestamp: 1_700_000_000n,
        difficulty: 0n,
      },
      { common, skipConsensusFormatValidation: true },
    )
    const headHash = bytesToHex(header.hash())
    const status = { ...MAINNET_STATUS_JSON, bestHash: headHash, latestBlock: '0x1036640' }

    const keyB = genPrivateKey()
    const idB = nodeIdFromPrivateKey(keyB)
    const BASE = 31100

    const nodeB = await createThreadedNetwork({
      inProcess: true,
      privateKey: keyB,
      chain: 'mainnet',
      maxPeers: 2,
      capabilities: ['eth68'],
      endpoint: { address: '127.0.0.1', udpPort: BASE + 1, tcpPort: BASE + 1 },
      listenPort: BASE + 1,
      status,
      goodCitizen: false,
      shouldFindNeighbours: false,
      throttleDiscovery: false,
    })

    nodeB.events.on('protocol', (msg) => {
      if (msg.protocol === 'eth' && msg.code === EthMessageCodes.GET_BLOCK_HEADERS) {
        const reply = encodeBlockHeadersReply(68, header.serialize())
        nodeB.sendEthMessage(peerIdToBytes(msg.peerId), EthMessageCodes.BLOCK_HEADERS, reply)
      }
    })

    const spine = createSpine('mainnet', 1n)
    let handle: Awaited<ReturnType<typeof startPeerCoordinator>> | undefined
    try {
      handle = await startPeerCoordinator({
        spine,
        network: 'mainnet',
        inProcess: true,
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
                `timeout waiting for pivot (peers=${spine.peers.size} pivot=${String(spine.pivotBlockNumber)} diags=${spine.diagnosticRingBuffer.length})`,
              ),
            ),
          20_000,
        )
        const tick = setInterval(() => {
          if (spine.pivotBlockNumber === 17_000_000n && spine.pivotStateRoot !== undefined) {
            clearTimeout(timer)
            clearInterval(tick)
            resolve()
          }
        }, 50)
      })

      assert.equal(spine.pivotBlockNumber, 17_000_000n)
      assert.equal(bytesToHex(spine.pivotStateRoot!), bytesToHex(header.stateRoot))
    } finally {
      handle?.stop()
      nodeB.stop()
    }
  }, 30_000)
})
