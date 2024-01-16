import { Common } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import {
  calculateSigRecovery,
  concatBytes,
  randomBytes,
  setLengthLeft,
  utf8ToBytes,
} from '@ethereumjs/util'
import {
  keccak256,
  secp256k1Expand,
  secp256k1Recover,
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
})
