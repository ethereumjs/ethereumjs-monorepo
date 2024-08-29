import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import * as verkleBlockJSON from '../../statemanager/test/testdata/verkleKaustinen6Block72.json'
import {
  type VerkleCrypto,
  type VerkleExecutionWitness,
  VerkleLeafType,
  bytesToHex,
  concatBytes,
  createAddressFromString,
  getVerkleKey,
  getVerkleStem,
  hexToBytes,
  intToBytes,
  randomBytes,
  verifyVerkleProof,
} from '../src/index.js'

describe('Verkle cryptographic helpers', () => {
  let verkle: VerkleCrypto
  beforeAll(async () => {
    verkle = await loadVerkleCrypto()
  })

  it('getVerkleStem(): returns the expected stems', () => {
    // Empty address
    assert.equal(
      bytesToHex(
        getVerkleStem(
          verkle,
          createAddressFromString('0x0000000000000000000000000000000000000000'),
        ),
      ),
      '0x1a100684fd68185060405f3f160e4bb6e034194336b547bdae323f888d5332',
    )

    // Non-empty address
    assert.equal(
      bytesToHex(
        getVerkleStem(
          verkle,
          createAddressFromString('0x71562b71999873DB5b286dF957af199Ec94617f7'),
        ),
      ),
      '0x1540dfad7755b40be0768c6aa0a5096fbf0215e0e8cf354dd928a178346466',
    )
  })

  it('verifyVerkleProof(): should verify verkle proofs', () => {
    // Src: Kaustinen6 testnet, block 71 state root (parent of block 72)
    const prestateRoot = hexToBytes(
      '0x64e1a647f42e5c2e3c434531ccf529e1b3e93363a40db9fc8eec81f492123510',
    )
    const executionWitness = verkleBlockJSON.executionWitness as VerkleExecutionWitness
    assert.isTrue(verifyVerkleProof(verkle, prestateRoot, executionWitness))
  })

  it('verifyVerkleProof(): should return false for invalid verkle proofs', () => {
    // Random preStateRoot
    const prestateRoot = randomBytes(32)
    const executionWitness = verkleBlockJSON.executionWitness as VerkleExecutionWitness
    // Modify the proof to make it invalid
    assert.isFalse(verifyVerkleProof(verkle, prestateRoot, executionWitness))
  })
})

describe('should generate valid tree keys', () => {
  it('should generate valid keys for each VerkleLeafType', () => {
    const stem = hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d')
    for (const leaf of [
      VerkleLeafType.Version,
      VerkleLeafType.Balance,
      VerkleLeafType.Nonce,
      VerkleLeafType.CodeHash,
      VerkleLeafType.CodeSize,
    ]) {
      const key = getVerkleKey(stem, leaf)
      assert.equal(key.length, 32)
      assert.deepEqual(key, concatBytes(stem, intToBytes(leaf)))
    }
  })
})
