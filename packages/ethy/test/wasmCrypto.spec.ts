import { equalsBytes, hexToBytes } from '@ethereumjs/util'
import { keccak_256 as nobleKeccak256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { createEthyNode } from '../src/core/createEthyNode.ts'
import { ethyKeccak256, ethyKeccakBackend, initEthyKeccak } from '../src/crypto/keccak.ts'
import { encodeGetAccountRange } from '../src/sync/accountSync.ts'
import { encodeGetStorageRanges } from '../src/sync/codeAndStorageSync.ts'
import { verifyAccountRangeJob, verifyStorageRangeJob } from '../src/sync/snapVerifyJob.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

const EMPTY_DIGEST = hexToBytes(
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
)

function payloadOfLength(n: number): Uint8Array {
  const buf = new Uint8Array(n)
  for (let i = 0; i < n; i++) buf[i] = i & 0xff
  return buf
}

describe('[Ethy/Crypto]: @awasm/noble keccak', () => {
  it('ethyKeccak256 matches @noble/hashes on boundary lengths', async () => {
    await initEthyKeccak()
    assert.strictEqual(ethyKeccakBackend(), 'awasm')
    const lengths = [0, 32, 135, 136, 137, 4096]
    for (const len of lengths) {
      const input = payloadOfLength(len)
      const expected = nobleKeccak256(input)
      const actual = ethyKeccak256(input)
      assert.ok(equalsBytes(actual, expected), `length ${len}`)
    }
    assert.ok(equalsBytes(ethyKeccak256(new Uint8Array(0)), EMPTY_DIGEST))
  })

  it('createEthyNode wires customCrypto.keccak256', async () => {
    await initEthyKeccak()
    const node = createEthyNode({ network: 'sepolia', chainId: 11155111n, demo: true })
    assert.strictEqual(node.stateManager.common?.customCrypto.keccak256, ethyKeccak256)
  })

  it('verifyAccountRangeJob and verifyStorageRangeJob accept synthetic proofs', async () => {
    await initEthyKeccak()
    const peer = await SyntheticSnapPeer.create(1)
    const account = peer.accounts[0]!
    assert.isDefined(account.code)

    let hashCalls = 0
    const countingHash = (data: Uint8Array) => {
      hashCalls++
      return ethyKeccak256(data)
    }

    const accountReq = encodeGetAccountRange(
      1n,
      peer.rootHash,
      account.accountHash,
      account.accountHash,
      512 * 1024,
    )
    const accountReply = await peer.buildAccountRangeReply(accountReq)
    const accountOk = await verifyAccountRangeJob(
      { stateRoot: peer.rootHash, payload: accountReply, origin: account.accountHash },
      countingHash,
    )
    assert.strictEqual(accountOk.ok, true)
    assert.ok(hashCalls > 0)

    const wrongRoot = new Uint8Array(peer.rootHash)
    wrongRoot[0]! ^= 0xff
    const accountBad = await verifyAccountRangeJob(
      { stateRoot: wrongRoot, payload: accountReply, origin: account.accountHash },
      countingHash,
    )
    assert.strictEqual(accountBad.ok, false)

    const storageReq = encodeGetStorageRanges(
      2n,
      peer.rootHash,
      [account.accountHash],
      new Uint8Array(32),
      new Uint8Array(32).fill(0xff),
      128 * 1024,
    )
    const storageReply = await peer.buildStorageRangesReply(storageReq)
    const storageOk = await verifyStorageRangeJob(
      {
        accounts: [{ accountHash: account.accountHash, storageRoot: account.account.storageRoot }],
        replyPayload: storageReply,
        origin: new Uint8Array(32),
      },
      countingHash,
    )
    assert.strictEqual(storageOk.ok, true)
    assert.strictEqual(storageOk.perAccount?.[0]?.ok, true)

    const wrongStorageRoot = new Uint8Array(account.account.storageRoot)
    wrongStorageRoot[0]! ^= 0xff
    const storageBad = await verifyStorageRangeJob(
      {
        accounts: [{ accountHash: account.accountHash, storageRoot: wrongStorageRoot }],
        replyPayload: storageReply,
        origin: new Uint8Array(32),
      },
      countingHash,
    )
    assert.strictEqual(storageBad.perAccount?.[0]?.ok, false)
  })
})
