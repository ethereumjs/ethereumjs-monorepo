import { Common } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import {
  BIGINT_2,
  calculateSigRecovery,
  concatBytes,
  ecsign,
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
import { sha256 as jsSha256 } from 'ethereum-cryptography/sha256.js'
import { assert, describe, it } from 'vitest'
describe('WASM crypto tests', () => {
  it('should compute public key and hash correctly using common.customCrypto functions', async () => {
    const wasmecrecover = (
      msgHash: Uint8Array,
      v: bigint,
      r: Uint8Array,
      s: Uint8Array,
      chainID?: bigint
    ) =>
      secp256k1Expand(
        secp256k1Recover(
          msgHash,
          concatBytes(setLengthLeft(r, 32), setLengthLeft(s, 32)),
          Number(calculateSigRecovery(v, chainID))
        )
      ).slice(1)

    await waitReady()
    const commonWithCustomCrypto = new Common({
      chain: 'mainnet',
      customCrypto: {
        ecrecover: wasmecrecover,
        keccak256,
      },
    })
    const common = new Common({ chain: 'mainnet' })

    const pk = randomBytes(32)
    const tx = LegacyTransaction.fromTxData({}, { common }).sign(pk)
    const tx2 = LegacyTransaction.fromTxData({}, { common: commonWithCustomCrypto }).sign(pk)

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
    const wasmSign = (msg: Uint8Array, pk: Uint8Array, chainId?: bigint) => {
      if (msg.length < 32) {
        // WASM errors with `unreachable` if we try to pass in less than 32 bytes in the message
        throw new Error('message length must be 32 bytes or greater')
      }
      const buf = secp256k1Sign(msg, pk)
      const r = buf.slice(0, 32)
      const s = buf.slice(32, 64)
      const v =
        chainId === undefined
          ? BigInt(buf[64] + 27)
          : BigInt(buf[64] + 35) + BigInt(chainId) * BIGINT_2

      return { r, s, v }
    }

    await waitReady()
    const msg = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
    const pk = hexToBytes('0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1')
    const jsSig = ecsign(msg, pk)
    const wasmSig = wasmSign(msg, pk)
    assert.deepEqual(wasmSig, jsSig, 'wasm signatures produce same result as js signatures')
    assert.throws(
      () => wasmSign(randomBytes(31), randomBytes(32)),
      'message length must be 32 bytes or greater'
    )
  })
})
