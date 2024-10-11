import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { verkleKaustinen6Block72Data } from '../../statemanager/test/testdata/verkleKaustinen6Block72.js'
import {
  Account,
  VERKLE_CODE_CHUNK_SIZE,
  type VerkleCrypto,
  type VerkleExecutionWitness,
  VerkleLeafType,
  bytesToHex,
  chunkifyCode,
  concatBytes,
  createAddressFromString,
  decodeVerkleLeafBasicData,
  encodeVerkleLeafBasicData,
  generateChunkSuffixes,
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
    const executionWitness = {
      ...verkleKaustinen6Block72Data.executionWitness,
      parentStateRoot: bytesToHex(prestateRoot),
    } as VerkleExecutionWitness
    assert.isTrue(verifyVerkleProof(verkle, executionWitness))
  })

  it('verifyVerkleProof(): should return false for invalid verkle proofs', () => {
    // Random preStateRoot
    const prestateRoot = randomBytes(32)
    const executionWitness = {
      ...verkleKaustinen6Block72Data.executionWitness,
      parentStateRoot: bytesToHex(prestateRoot),
    } as VerkleExecutionWitness
    // Modify the proof to make it invalid
    assert.isFalse(verifyVerkleProof(verkle, executionWitness))
  })
})

describe('should generate valid tree keys', () => {
  it('should generate valid keys for each VerkleLeafType', () => {
    const stem = hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d')
    for (const leaf of [VerkleLeafType.BasicData, VerkleLeafType.CodeHash]) {
      const key = getVerkleKey(stem, leaf)
      assert.equal(key.length, 32)
      assert.deepEqual(key, concatBytes(stem, intToBytes(leaf)))
    }
  })
})

describe('should encode and decode basic data values', () => {
  const account = new Account(2n, 123n)
  it('should encode basicData to 32 bytes', () => {
    const basicDataBytes = encodeVerkleLeafBasicData(account)
    assert.equal(basicDataBytes.length, 32)
    assert.equal(
      basicDataBytes.slice(8, 16)[7],
      2,
      'confirm that last byte of nonce slice is equal to nonce (i.e. coded as bigEndian)',
    )
    const decodedData = decodeVerkleLeafBasicData(basicDataBytes)
    assert.equal(decodedData.balance, 123n)
    assert.equal(decodedData.nonce, 2n)
  })
})

describe('should chunkify code, accounting for leading PUSHDATA bytes', () => {
  it('should chunkify code with overflow PUSHDATA', () => {
    const byteCode = hexToBytes(
      '0x7faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ) // PUSH32 aa.....
    const chunkifiedCode = chunkifyCode(byteCode)
    assert.equal(chunkifiedCode.length, 2, 'bytecode of length 33 should be in 2 chunks')
    assert.equal(
      chunkifiedCode[1][0],
      2,
      'second chunk should have a 2 in first position (for 2 bytes of PUSHDATA overflow from previous chunk)',
    )
  })
  it('should chunkify code without overflow PUSHDATA', () => {
    const byteCode = hexToBytes(
      '0x70aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ) // PUSH17 aa.....
    const chunkifiedCode = chunkifyCode(byteCode)
    assert.equal(chunkifiedCode.length, 2, 'bytecode of length 33 should be in 2 chunks')
    assert.equal(
      chunkifiedCode[1][0],
      0,
      'second chunk should have a 0 in first position (for 0 bytes of PUSHDATA overflow from previous chunk)',
    )
  })
  it('should generate the correct number of chunks, suffixes, and stems', () => {
    const codeSizes = [0, 1, 257, 25460, 30000]
    const expectedSuffixes = [0, 1, 257, 25460, 30000]
    for (const [idx, size] of codeSizes.entries()) {
      const suffixes = generateChunkSuffixes(size)
      const chunks = chunkifyCode(randomBytes(size))
      assert.equal(suffixes.length, expectedSuffixes[idx])
      assert.equal(Math.ceil(size / VERKLE_CODE_CHUNK_SIZE), chunks.length)
      for (const suffix of suffixes) {
        if (suffix > 255 || suffix < 0) assert.fail(`suffix must in range 0-255, got ${suffix}`)
      }
    }
  })
})
