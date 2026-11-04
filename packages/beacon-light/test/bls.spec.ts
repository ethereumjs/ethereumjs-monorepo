import { Common, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { bls12_381 } from '@noble/curves/bls12-381.js'

const blsLong = bls12_381.longSignatures
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'
import { assert, beforeAll, describe, it } from 'vitest'

import {
  ETH_BLS_DST,
  computeSigningRoot,
  computeSyncCommitteeDomain,
  verifySyncCommitteeSignature,
} from '../src/index.ts'

import { buildTestSyncCommittee, deterministicSecretKey } from './fixtures/syntheticCommittee.ts'

describe('[BeaconLight]: BLS sync committee verification', () => {
  let publicKeys: Uint8Array[]
  let secretKeys: Uint8Array[]

  beforeAll(() => {
    const built = buildTestSyncCommittee()
    publicKeys = built.committee.publicKeys
    secretKeys = built.secretKeys
  }, 60_000)

  it('accepts 342-of-512 aggregate on the signing root', () => {
    const signingRoot = nobleSha256(new Uint8Array([1, 2, 3]))
    const signingMessage = blsLong.hash(signingRoot, ETH_BLS_DST)
    const indices = Array.from({ length: 342 }, (_, i) => i)
    const sigCache = new Map<Uint8Array, Uint8Array>()
    const sigs = indices.map((i) => {
      const sk = secretKeys[i]!
      let s = sigCache.get(sk)
      if (s === undefined) {
        s = blsLong.sign(signingMessage, sk).toBytes()
        sigCache.set(sk, s)
      }
      return s
    })
    const signature = blsLong.aggregateSignatures(sigs).toBytes()
    const bits = new Uint8Array(64)
    for (const i of indices) {
      bits[i >> 3]! |= 1 << (i & 7)
    }
    const result = verifySyncCommitteeSignature({
      publicKeys,
      syncCommitteeBits: bits,
      signature,
      signingRoot,
    })
    assert.ok(result.valid)
    assert.equal(result.participantCount, 342)
  })

  it('rejects 341 participants and tampered signing root', () => {
    const signingRoot = nobleSha256(new Uint8Array([4]))
    const signingMessage = blsLong.hash(signingRoot, ETH_BLS_DST)
    const indices = Array.from({ length: 341 }, (_, i) => i)
    const sigCache = new Map<Uint8Array, Uint8Array>()
    const sigs = indices.map((i) => {
      const sk = secretKeys[i]!
      let s = sigCache.get(sk)
      if (s === undefined) {
        s = blsLong.sign(signingMessage, sk).toBytes()
        sigCache.set(sk, s)
      }
      return s
    })
    const signature = blsLong.aggregateSignatures(sigs).toBytes()
    const bits = new Uint8Array(64)
    for (const i of indices) {
      bits[i >> 3]! |= 1 << (i & 7)
    }
    const low = verifySyncCommitteeSignature({
      publicKeys,
      syncCommitteeBits: bits,
      signature,
      signingRoot,
    })
    assert.ok(!low.valid)
    const badRoot = nobleSha256(new Uint8Array([5]))
    const fullBits = new Uint8Array(64)
    fullBits.fill(0xff)
    const fullSig = blsLong.sign(signingMessage, secretKeys[0]!).toBytes()
    const tampered = verifySyncCommitteeSignature({
      publicKeys,
      syncCommitteeBits: fullBits,
      signature: fullSig,
      signingRoot: badRoot,
      minParticipants: 1,
    })
    assert.ok(!tampered.valid)
  }, 60_000)

  it('domain from Mainnet Electra epoch builds a signing root', () => {
    const common = new Common({ chain: Mainnet })
    const gvr = hexToBytes(common.beaconLightClient()!.genesisValidatorsRoot)
    const domain = computeSyncCommitteeDomain('0x05000000', gvr, nobleSha256)
    const headerRoot = new Uint8Array(32)
    headerRoot[0] = 7
    const signingRoot = computeSigningRoot(headerRoot, domain, nobleSha256)
    assert.equal(signingRoot.length, 32)
  })
})
