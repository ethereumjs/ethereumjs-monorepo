import { EthyMessageCodes } from '@ethereumjs/devp2p'
import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { bytesToUnprefixedHex } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import {
  CUSTODY_WITNESS_BATCH_MS_DEFAULT,
  CustodyStateResolver,
} from '../src/custody/custodyStateResolver.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { StatyWriteIndex } from '../src/staty/writeIndex.ts'

function stubEthyPeer(peerId: string, bucketMask = 0xffff): WorkerPeerSnapshot {
  return {
    id: peerId,
    clientId: 'ethy-test',
    caps: [],
    ethySession: true,
    ethyStatus: {
      basePivotBlock: '100',
      basePivotStateRoot: `${'aa'.repeat(64)}`,
      bucketsBitmask: `0x${bucketMask.toString(16)}`,
      codeBucketsBitmask: `0x${bucketMask.toString(16)}`,
      storageBucketsBitmask: `0x${bucketMask.toString(16)}`,
      balEarliestBlock: '100',
      balLatestBlock: '100',
      latestBlockHash: `${'cc'.repeat(64)}`,
    },
  }
}

describe('custodyStateResolver', () => {
  it('resolveAccountMiss returns undefined without peers', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const writeIndex = new StatyWriteIndex(keccak_256)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex,
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const hash = new Uint8Array(32)
    hash[0] = 0x20
    const out = await resolver.resolveAccountMiss(hash, 'swarm-only')
    assert.equal(out, undefined)
  })

  it('resolveStorageMiss returns undefined without storage custodian peer', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x40
    const slotHash = keccak_256(new Uint8Array([7]))
    const out = await resolver.resolveStorageMiss(accountHash, slotHash, 'swarm-only')
    assert.equal(out, undefined)
  })

  it('resolveAccountMiss ignores local-only policy without network calls', async () => {
    let sends = 0
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () =>
        ({
          sendEthyMessage: () => {
            sends += 1
          },
        }) as never,
      getPeers: () => [stubEthyPeer(`0x${'bb'.repeat(32)}`)],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: true,
      balEarliestBlock: () => 0n,
      witnessBatchWindowMs: 0,
    })
    const hash = new Uint8Array(32)
    hash[0] = 0x20
    const out = await resolver.resolveAccountMiss(hash, 'local-only')
    assert.equal(out, undefined)
    assert.equal(sends, 0)
  })

  it('swarm-only leaves snap-bootstrap path unused when ETHY has no custodian', async () => {
    let sends = 0
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () =>
        ({
          sendEthyMessage: () => {
            sends += 1
          },
        }) as never,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const hash = new Uint8Array(32)
    hash[0] = 0x20
    assert.equal(await resolver.resolveAccountMiss(hash, 'swarm-only'), undefined)
    assert.equal(await resolver.resolveAccountMiss(hash, 'full'), undefined)
    assert.equal(sends, 0)
  })

  it('coalesces witness GET_STATE_WITNESS within the batch window', async () => {
    const peerId = `0x${'bb'.repeat(32)}`
    const witnessSends: unknown[][] = []
    let lastReqId = 0n
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () =>
        ({
          sendEthyMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
            if (code !== EthyMessageCodes.GET_STATE_WITNESS) return
            const decoded = RLP.decode(payload) as unknown[]
            witnessSends.push(decoded)
            lastReqId = BigInt(`0x${bytesToUnprefixedHex(decoded[0] as Uint8Array)}`)
            resolver.handleEthyResponse(
              peerId,
              EthyMessageCodes.STATE_WITNESS,
              RLP.encode([decoded[0], []] as never),
            )
          },
        }) as never,
      getPeers: () => [stubEthyPeer(peerId)],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 200n,
      witnessBatchWindowMs: CUSTODY_WITNESS_BATCH_MS_DEFAULT,
    })
    const h1 = new Uint8Array(32)
    h1[0] = 0x20
    const h2 = new Uint8Array(32)
    h2[0] = 0x21
    const p1 = resolver.resolveAccountMiss(h1, 'swarm-only')
    const p2 = resolver.resolveAccountMiss(h2, 'swarm-only')
    assert.equal(witnessSends.length, 0)
    await new Promise((r) => setTimeout(r, CUSTODY_WITNESS_BATCH_MS_DEFAULT + 10))
    const [r1, r2] = await Promise.all([p1, p2])
    assert.equal(r1, undefined)
    assert.equal(r2, undefined)
    assert.equal(witnessSends.length, 1)
    const queries = witnessSends[0]![3] as unknown[][]
    assert.equal(queries.length, 2)
    assert.isTrue(lastReqId > 0n)
  })

  it('resolveCodeMiss returns undefined when no code custodian peer', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const codeHash = keccak_256(new Uint8Array([1, 2, 3]))
    const out = await resolver.resolveCodeMiss(codeHash, 'full')
    assert.equal(out, undefined)
  })
})
