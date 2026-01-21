import { Common, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bigIntToBytes,
  bytesToHex,
  calculateSigRecovery,
  concatBytes,
  hexToBytes,
  randomBytes,
  setLengthLeft,
  utf8ToBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import {
  keccak256,
  secp256k1Expand,
  secp256k1Recover,
  secp256k1Sign,
  waitReady,
  sha256 as wasmSha256,
} from '@polkadot/wasm-crypto'

import { SIGNER_A } from '@ethereumjs/testdata'
import { sha256 as jsSha256 } from '@noble/hashes/sha2.js'
import { assert, describe, it } from 'vitest'
import { getCryptoFunctions } from '../../bin/utils.ts'
describe('WASM crypto tests', () => {
  it('should compute public key and hash correctly using common.customCrypto functions', async () => {
    const wasmecrecover = (
      msgHash: Uint8Array,
      v: bigint,
      r: Uint8Array,
      s: Uint8Array,
      chainID?: bigint,
    ) =>
      secp256k1Expand(
        secp256k1Recover(
          msgHash,
          concatBytes(setLengthLeft(r, 32), setLengthLeft(s, 32)),
          Number(calculateSigRecovery(v, chainID)),
        ),
      ).slice(1)

    await waitReady()
    const commonWithCustomCrypto = new Common({
      chain: Mainnet,
      customCrypto: {
        ecrecover: wasmecrecover,
        keccak256,
      },
    })
    const common = new Common({ chain: Mainnet })

    const pk = randomBytes(32)
    const tx = createLegacyTx({}, { common }).sign(pk)
    const tx2 = createLegacyTx({}, { common: commonWithCustomCrypto }).sign(pk)

    assert.deepEqual(tx.getSenderPublicKey(), tx2.getSenderPublicKey())
    assert.deepEqual(tx.hash(), tx2.hash())
  })

  it('should compute same SHA256 hash whether js or WASM crypto used', async () => {
    await waitReady()
    const msg = utf8ToBytes('hello world')
    const jsHash = jsSha256(msg)
    const wasmHash = wasmSha256(msg)
    assert.deepEqual(jsHash, wasmHash)
  })

  it('should compute the same signature whether js or WASM signature used', async () => {
    const crypto = await getCryptoFunctions(true)
    const wasmSign = crypto.ecsign!

    await waitReady()
    const msg = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
    const jsSig = secp256k1.sign(msg, SIGNER_A.privateKey)
    const wasmSig = wasmSign(msg, SIGNER_A.privateKey)
    assert.deepEqual(wasmSig, jsSig, 'wasm signatures produce same result as js signatures')
  })
  it('should recover public key from WASM signature using both WASM and JS recovery', async () => {
    const crypto = await getCryptoFunctions(true)
    await waitReady()
    const hash = hexToBytes('0x8c6d72155f746a9424b0621d82c5f5d3f6cc82e497b15df1b2ae601c8c14f75c')
    const expectedPubkey = secp256k1.getPublicKey(SIGNER_A.privateKey, false)

    // Generate WASM signature (65 bytes: r[32] + s[32] + recovery[1])
    const wasmSig = secp256k1Sign(hash, SIGNER_A.privateKey)
    const wasmSigCompact = wasmSig.slice(0, 64)
    const wasmRecovery = wasmSig[64]

    // Recover using WASM (returns compressed, expand to uncompressed)
    const wasmRecoveredCompressed = secp256k1Recover(hash, wasmSigCompact, wasmRecovery)
    const wasmRecoveredPubkey = secp256k1Expand(wasmRecoveredCompressed)

    // Recover using JS ecdsaRecover (returns uncompressed)
    const jsRecoveredPubkey = crypto.ecdsaRecover!(wasmSigCompact, wasmRecovery, hash)

    // Both should recover the correct public key
    assert.strictEqual(
      bytesToHex(wasmRecoveredPubkey),
      bytesToHex(expectedPubkey),
      'WASM recovery from WASM signature should match expected pubkey',
    )
    assert.strictEqual(
      bytesToHex(jsRecoveredPubkey),
      bytesToHex(expectedPubkey),
      'JS recovery from WASM signature should match expected pubkey',
    )
    assert.strictEqual(
      bytesToHex(wasmRecoveredPubkey),
      bytesToHex(jsRecoveredPubkey),
      'WASM and JS recovery should produce identical results',
    )
  })

  it('should recover public key from JS signature using both WASM and JS recovery', async () => {
    const crypto = await getCryptoFunctions(true)
    await waitReady()
    const hash = hexToBytes('0x8c6d72155f746a9424b0621d82c5f5d3f6cc82e497b15df1b2ae601c8c14f75c')
    const expectedPubkey = secp256k1.getPublicKey(SIGNER_A.privateKey, false)

    // Generate JS signature using noble/curves with recovered format (returns 65-byte Uint8Array)
    const jsSigBytes = secp256k1.sign(hash, SIGNER_A.privateKey, {
      prehash: false,
      format: 'recovered',
    })
    // Parse signature to extract r, s, recovery
    const { r, s, recovery: jsRecovery } = secp256k1.Signature.fromBytes(jsSigBytes, 'recovered')
    // Construct 64-byte compact signature from r and s BigInts
    const jsSigCompact = concatBytes(
      setLengthLeft(bigIntToBytes(r), 32),
      setLengthLeft(bigIntToBytes(s), 32),
    )

    assert.isDefined(jsRecovery, 'JS signature should have recovery')

    // Recover using JS ecdsaRecover (returns uncompressed)
    const jsRecoveredPubkey = crypto.ecdsaRecover!(jsSigCompact, jsRecovery!, hash)

    // Recover using WASM (returns compressed, expand to uncompressed)
    const wasmRecoveredCompressed = secp256k1Recover(hash, jsSigCompact, jsRecovery!)
    const wasmRecoveredPubkey = secp256k1Expand(wasmRecoveredCompressed)

    // Both should recover the correct public key
    assert.strictEqual(
      bytesToHex(jsRecoveredPubkey),
      bytesToHex(expectedPubkey),
      'JS recovery from JS signature should match expected pubkey',
    )
    assert.strictEqual(
      bytesToHex(wasmRecoveredPubkey),
      bytesToHex(expectedPubkey),
      'WASM recovery from JS signature should match expected pubkey',
    )
    assert.strictEqual(
      bytesToHex(jsRecoveredPubkey),
      bytesToHex(wasmRecoveredPubkey),
      'JS and WASM recovery should produce identical results',
    )
  })
})
