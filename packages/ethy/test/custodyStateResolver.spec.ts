import { EthyMessageCodes } from '@ethereumjs/devp2p'
import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'
import { MerklePatriciaTrie, createMerkleProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  bigIntToUnpaddedBytes,
  bytesToUnprefixedHex,
  createAccount,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import {
  CUSTODY_WITNESS_BATCH_MS_DEFAULT,
  CustodyStateResolver,
} from '../src/custody/custodyStateResolver.ts'
import { buildWitnessFoldContext } from '../src/custody/custodyWitnessFold.ts'
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

  it('omitted key in STATE_WITNESS stays undefined (never fabricates proven-empty) and caches verified witness', async () => {
    const peerId = `0x${'cc'.repeat(32)}`
    const trie = new MerklePatriciaTrie({
      useKeyHashing: false,
      useKeyHashingFunction: ethyKeccak256,
    })
    const acctA = new Uint8Array(32)
    acctA[0] = 0x20
    acctA[31] = 0x01
    const acctB = new Uint8Array(32)
    acctB[0] = 0x20
    acctB[31] = 0x02
    const rlpA = createAccount({ nonce: 1n, balance: 500n }).serialize()
    await trie.put(acctA, rlpA)
    const root = trie.root()
    const proofA = await createMerkleProof(trie, acctA)

    const spine = createSpine('mainnet', 1n)
    spine.pivotBlockNumber = 100n
    spine.pivotStateRoot = root
    spine.headBlockNumber = 100n
    spine.lastVerifiedBlockNumber = 100n

    const cachedWitnesses: Uint8Array[] = []
    const resolver = new CustodyStateResolver({
      getClient: () =>
        ({
          putEthyWitness: (w: { accountHash: Uint8Array }) => {
            cachedWitnesses.push(w.accountHash)
          },
          sendEthyMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
            const decoded = RLP.decode(payload) as unknown[]
            if (code === EthyMessageCodes.GET_STATE_WITNESS) {
              // Return a valid witness group containing ONLY acctA (acctB is omitted).
              const group = [bigIntToUnpaddedBytes(100n), root, [[acctA, rlpA]], [], proofA]
              resolver.handleEthyResponse(
                peerId,
                EthyMessageCodes.STATE_WITNESS,
                RLP.encode([decoded[0], [group]] as never),
              )
              return
            }
            if (code === EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK) {
              // Empty unverified chunk reply so Step 2 resolves to undefined rather than timing out.
              resolver.handleEthyResponse(
                peerId,
                EthyMessageCodes.PROVEN_ACCOUNT_CHUNK,
                RLP.encode([decoded[0], intToUnpaddedBytes(2)] as never),
              )
            }
          },
        }) as never,
      getPeers: () => [stubEthyPeer(peerId)],
      spine,
      writeIndex: new StatyWriteIndex(ethyKeccak256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 100n,
      witnessBatchWindowMs: 10,
    })

    const [resA, resB] = await Promise.all([
      resolver.resolveAccountMiss(acctA, 'swarm-only'),
      resolver.resolveAccountMiss(acctB, 'swarm-only'),
    ])
    assert.instanceOf(resA, Uint8Array)
    assert.equal(resB, undefined)
    assert.equal(cachedWitnesses.length, 1)
    assert.isTrue(equalsBytes(cachedWitnesses[0]!, acctA))
  })

  it('rejects self-consistent STATE_WITNESS with forged anchorStateRoot', async () => {
    const peerId = `0x${'dd'.repeat(32)}`
    const forgedTrie = new MerklePatriciaTrie({
      useKeyHashing: false,
      useKeyHashingFunction: ethyKeccak256,
    })
    const acct = new Uint8Array(32)
    acct[0] = 0x20
    const forgedRlp = createAccount({ nonce: 0n, balance: 999_999n }).serialize()
    await forgedTrie.put(acct, forgedRlp)
    const forgedRoot = forgedTrie.root()
    const forgedProof = await createMerkleProof(forgedTrie, acct)

    const spine = createSpine('mainnet', 1n)
    spine.pivotBlockNumber = 100n
    spine.pivotStateRoot = new Uint8Array(32).fill(0x99)
    spine.headBlockNumber = 100n
    spine.lastVerifiedBlockNumber = 100n

    const resolver = new CustodyStateResolver({
      getClient: () =>
        ({
          sendEthyMessage: (_peer: Uint8Array, code: number, payload: Uint8Array) => {
            const decoded = RLP.decode(payload) as unknown[]
            if (code === EthyMessageCodes.GET_STATE_WITNESS) {
              const group = [
                bigIntToUnpaddedBytes(100n),
                forgedRoot,
                [[acct, forgedRlp]],
                [],
                forgedProof,
              ]
              resolver.handleEthyResponse(
                peerId,
                EthyMessageCodes.STATE_WITNESS,
                RLP.encode([decoded[0], [group]] as never),
              )
              return
            }
            if (code === EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK) {
              resolver.handleEthyResponse(
                peerId,
                EthyMessageCodes.PROVEN_ACCOUNT_CHUNK,
                RLP.encode([decoded[0], intToUnpaddedBytes(2)] as never),
              )
            }
          },
        }) as never,
      getPeers: () => [stubEthyPeer(peerId)],
      spine,
      writeIndex: new StatyWriteIndex(ethyKeccak256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 100n,
      witnessBatchWindowMs: 0,
    })

    const out = await resolver.resolveAccountMiss(acct, 'swarm-only')
    assert.equal(out, undefined)
  })

  it('resolveCodeMiss falls back to any nonzero codeBucketsBitmask custodian', async () => {
    const peerId = `0x${'ee'.repeat(32)}`
    const code = new Uint8Array([0x60, 0x2a, 0x60, 0x00, 0x52])
    const codeHash = ethyKeccak256(code)
    const otherBucket = ((codeHash[0]! >> 4) + 5) & 0xf
    const peer = stubEthyPeer(peerId, 1 << otherBucket)

    const spine = createSpine('mainnet', 1n)
    const resolver = new CustodyStateResolver({
      getClient: () =>
        ({
          sendEthyMessage: (_peer: Uint8Array, codeMsg: number, payload: Uint8Array) => {
            if (codeMsg !== EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE) return
            const decoded = RLP.decode(payload) as unknown[]
            resolver.handleEthyResponse(
              peerId,
              EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
              RLP.encode([decoded[0], intToUnpaddedBytes(0), [code]] as never),
            )
          },
        }) as never,
      getPeers: () => [peer],
      spine,
      writeIndex: new StatyWriteIndex(ethyKeccak256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
      witnessBatchWindowMs: 0,
    })

    const out = await resolver.resolveCodeMiss(codeHash, 'swarm-only')
    assert.instanceOf(out, Uint8Array)
    assert.isTrue(equalsBytes(out as Uint8Array, code))
  })

  it('buildWitnessFoldContext does not reuse pivotStateRoot for non-pivot balWindow blocks', () => {
    const spine = createSpine('mainnet', 1n)
    const pivotRoot = new Uint8Array(32).fill(0x11)
    const block101Root = new Uint8Array(32).fill(0x22)
    spine.pivotBlockNumber = 100n
    spine.pivotStateRoot = pivotRoot
    spine.headBlockNumber = 102n
    spine.lastVerifiedBlockNumber = 102n
    spine.balWindow = [
      { blockNumber: 101n, accountCount: 1, stateRoot: block101Root },
      { blockNumber: 102n, accountCount: 1 },
    ]
    const ctx = buildWitnessFoldContext(spine, new StatyWriteIndex(ethyKeccak256))
    assert.isTrue(equalsBytes(ctx.stateRootAt(100)!, pivotRoot))
    assert.isTrue(equalsBytes(ctx.stateRootAt(101)!, block101Root))
    assert.equal(ctx.stateRootAt(102), undefined)
  })
})
