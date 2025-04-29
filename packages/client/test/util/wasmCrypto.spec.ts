import { Common, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  calculateSigRecovery,
  concatBytes,
  hexToBytes,
  randomBytes,
  setLengthLeft,
  utf8ToBytes,
} from '@ethereumjs/util'
import {
  keccak256,
  secp256k1Expand,
  secp256k1Recover,
  secp256k1Sign,
  waitReady,
  sha256 as wasmSha256,
} from '@polkadot/wasm-crypto'
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js'

import { sha256 as jsSha256 } from 'ethereum-cryptography/sha256.js'
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
    const pk = hexToBytes('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
    const jsSig = secp256k1.sign(msg, pk)
    const wasmSig = wasmSign(msg, pk)
    assert.deepEqual(wasmSig, jsSig, 'wasm signatures produce same result as js signatures')
  })
  it('should have the same signature and verification', async () => {
    const crypto = await getCryptoFunctions(true)
    await waitReady()
    const pk = hexToBytes('0xbd3713a6da2c3624fa10bad8a52848b4291e3c9689ab50e0d2761e014d6e4cd7')
    const hash = hexToBytes('0x8c6d72155f746a9424b0621d82c5f5d3f6cc82e497b15df1b2ae601c8c14f75c')
    const jsSig = secp256k1.sign(hash, pk)
    const wasmSig = secp256k1Sign(hash, pk)
    assert.strictEqual(bytesToHex(wasmSig.slice(0, 64)), bytesToHex(jsSig.toCompactRawBytes()))
    const wasmRec = secp256k1Recover(hash, wasmSig.slice(0, 64), wasmSig[64])
    const jsRec = crypto.ecdsaRecover!(jsSig.toCompactRawBytes(), jsSig.recovery, hash)
    assert.strictEqual(bytesToHex(wasmRec), bytesToHex(jsRec))
  })
  it('should recover the same address', async () => {
    const crypto = await getCryptoFunctions(true)
    await waitReady()
    const pk = hexToBytes('0xbd3713a6da2c3624fa10bad8a52848b4291e3c9689ab50e0d2761e014d6e4cd7')
    const hash = hexToBytes('0x8c6d72155f746a9424b0621d82c5f5d3f6cc82e497b15df1b2ae601c8c14f75c')
    const jsSig = secp256k1.sign(hash, pk)
    const wasmRec = secp256k1Recover(hash, jsSig.toCompactRawBytes(), jsSig.recovery)
    const jsRec = crypto.ecdsaRecover!(jsSig.toCompactRawBytes(), jsSig.recovery, hash)
    assert.strictEqual(bytesToHex(wasmRec), bytesToHex(jsRec))
  })
})
