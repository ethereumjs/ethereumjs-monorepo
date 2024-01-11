import { Common } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { calculateSigRecovery, concatBytes, randomBytes, setLengthLeft } from '@ethereumjs/util'
import { keccak256, secp256k1Expand, secp256k1Recover, waitReady } from '@polkadot/wasm-crypto'
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
})
