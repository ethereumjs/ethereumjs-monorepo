import { Address, bytesToHex, hexToBytes, randomBytes } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import * as verkleBlockJSON from '../../statemanager/test/testdata/verkleKaustinen6Block72.json'
import { getStem, verifyProof } from '../src/index.js'

import type { VerkleCrypto } from '../src/index.js'
import type { VerkleExecutionWitness } from '@ethereumjs/block'

describe('Verkle cryptographic helpers', () => {
  let verkle: VerkleCrypto
  beforeAll(async () => {
    verkle = await loadVerkleCrypto()
  })

  it('getStem(): returns the expected stems', () => {
    // Empty address
    assert.equal(
      bytesToHex(getStem(verkle, Address.fromString('0x0000000000000000000000000000000000000000'))),
      '0x1a100684fd68185060405f3f160e4bb6e034194336b547bdae323f888d5332'
    )

    // Non-empty address
    assert.equal(
      bytesToHex(getStem(verkle, Address.fromString('0x71562b71999873DB5b286dF957af199Ec94617f7'))),
      '0x1540dfad7755b40be0768c6aa0a5096fbf0215e0e8cf354dd928a178346466'
    )
  })

  it('verifyProof(): should verify verkle proofs', () => {
    // Src: Kaustinen6 testnet, block 71 state root (parent of block 72)
    const prestateRoot = hexToBytes(
      '0x64e1a647f42e5c2e3c434531ccf529e1b3e93363a40db9fc8eec81f492123510'
    )
    const executionWitness = verkleBlockJSON.executionWitness as VerkleExecutionWitness
    assert.isTrue(verifyProof(verkle, prestateRoot, executionWitness))
  })

  it('verifyProof(): should return false for invalid verkle proofs', () => {
    // Random preStateRoot
    const prestateRoot = randomBytes(32)
    const executionWitness = verkleBlockJSON.executionWitness as VerkleExecutionWitness
    // Modify the proof to make it invalid
    assert.isFalse(verifyProof(verkle, prestateRoot, executionWitness))
  })
})
