import { Common, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex, calculateSigRecovery, concatBytes, setLengthLeft } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import {
  secp256k1Expand,
  secp256k1Recover,
  secp256k1Sign,
  waitReady,
  keccak256 as wasmKeccak256,
} from '@polkadot/wasm-crypto'
import { assert, beforeAll, describe, it } from 'vitest'

import type { CustomCrypto } from '@ethereumjs/common'

async function wasmCustomCrypto(): Promise<CustomCrypto> {
  await waitReady()
  return {
    keccak256: wasmKeccak256,
    ecsign: (msg, pk) => {
      const wasmSig = secp256k1Sign(msg, pk)
      return secp256k1.Signature.fromBytes(wasmSig.subarray(0, 64), 'compact')
        .addRecoveryBit(wasmSig[64])
        .toBytes('recovered')
    },
    ecrecover: (msgHash, v, r, s, chainID) =>
      secp256k1Expand(
        secp256k1Recover(
          msgHash,
          concatBytes(setLengthLeft(r, 32), setLengthLeft(s, 32)),
          Number(calculateSigRecovery(v, chainID)),
        ),
      ).slice(1),
  }
}

describe('[Tx]: customCrypto WASM backend (legacy tx)', () => {
  beforeAll(async () => {
    await waitReady()
  })

  it('matches noble hash, sender, and public key on a signed legacy tx', async () => {
    const pk = new Uint8Array(32)
    pk[31] = 1

    const nobleCommon = new Common({ chain: Mainnet })
    const wasmCommon = new Common({
      chain: Mainnet,
      customCrypto: await wasmCustomCrypto(),
    })

    const nobleTx = createLegacyTx({ nonce: 0, gasLimit: 21_000n }, { common: nobleCommon }).sign(
      pk,
      false,
    )
    const wasmTx = createLegacyTx({ nonce: 0, gasLimit: 21_000n }, { common: wasmCommon }).sign(
      pk,
      false,
    )

    assert.strictEqual(bytesToHex(wasmTx.hash()), bytesToHex(nobleTx.hash()))
    assert.strictEqual(wasmTx.getSenderAddress().toString(), nobleTx.getSenderAddress().toString())
    assert.strictEqual(
      bytesToHex(wasmTx.getSenderPublicKey()),
      bytesToHex(nobleTx.getSenderPublicKey()),
    )
  })
})
