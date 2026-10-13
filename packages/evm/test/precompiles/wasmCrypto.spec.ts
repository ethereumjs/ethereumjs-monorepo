import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  bytesToHex,
  bytesToUnprefixedHex,
  calculateSigRecovery,
  concatBytes,
  hexToBytes,
  setLengthLeft,
  utf8ToBytes,
} from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'
import {
  secp256k1Expand,
  secp256k1Recover,
  secp256k1Sign,
  waitReady,
  keccak256 as wasmKeccak256,
  sha256 as wasmSha256,
} from '@polkadot/wasm-crypto'
import { assert, beforeAll, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.ts'
import { precompile02 } from '../../src/precompiles/02-sha256.ts'

import type { CustomCrypto } from '@ethereumjs/common'
import type { EVM } from '../../src/evm.ts'

async function wasmCustomCrypto(): Promise<CustomCrypto> {
  await waitReady()
  return {
    keccak256: wasmKeccak256,
    sha256: wasmSha256,
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

const KECCAK_CODE = hexToBytes(`0x7f${'ab'.repeat(32)}20${'50'.repeat(8)}`)
const SHA256_INPUT = hexToBytes(`0x${'ab'.repeat(32)}`)

describe('[EVM/Precompile]: customCrypto WASM backend (EVM)', () => {
  beforeAll(async () => {
    await waitReady()
  })

  it('KECCAK256 opcode matches noble', async () => {
    const nobleCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
    const wasmCommon = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Prague,
      customCrypto: await wasmCustomCrypto(),
    })

    const nobleEvm = await createEVM({ common: nobleCommon })
    const wasmEvm = await createEVM({ common: wasmCommon })

    const nobleResult = await nobleEvm.runCode!({ code: KECCAK_CODE, gasLimit: BigInt(1_000_000) })
    const wasmResult = await wasmEvm.runCode!({ code: KECCAK_CODE, gasLimit: BigInt(1_000_000) })

    assert.strictEqual(
      bytesToHex(wasmResult.returnValue),
      bytesToHex(nobleResult.returnValue),
      'stack top after KECCAK256',
    )
  })

  it('ECRECOVER precompile matches noble', async () => {
    const prefix = bytesToUnprefixedHex(utf8ToBytes('\x19Ethereum Signed Message:\n32'))
    const hash = '852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46'
    const v = '000000000000000000000000000000000000000000000000000000000000001b'
    const r = 'b814eaab5953337fed2cf504a5b887cddd65a54b7429d7b191ff1331ca0726b1'
    const s = '264de2660d307112075c15f08ba9c25c9a0cc6f8119aff3e7efb0a942773abb0'
    const expectedAddress = '0xa6fb229e9b0a4e4ef52ea6991adcfc59207c7711'

    const nobleCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Petersburg })
    const wasmCommon = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Petersburg,
      customCrypto: await wasmCustomCrypto(),
    })

    const nobleEvm = await createEVM({ common: nobleCommon })
    const wasmEvm = await createEVM({ common: wasmCommon })
    const ecrecover = getActivePrecompiles(nobleCommon).get(
      '0000000000000000000000000000000000000001',
    )!

    const prefixedMessage = bytesToUnprefixedHex(keccak_256(hexToBytes(`0x${prefix}${hash}`)))
    const data = hexToBytes(`0x${prefixedMessage}${v}${r}${s}`)

    const nobleResult = await ecrecover({
      data,
      gasLimit: BigInt(0xffff),
      common: nobleCommon,
      _EVM: nobleEvm as EVM,
    })
    const wasmResult = await ecrecover({
      data,
      gasLimit: BigInt(0xffff),
      common: wasmCommon,
      _EVM: wasmEvm as EVM,
    })

    assert.strictEqual(
      bytesToHex(wasmResult.returnValue.slice(-20)),
      bytesToHex(nobleResult.returnValue.slice(-20)),
    )
    assert.strictEqual(bytesToHex(wasmResult.returnValue.slice(-20)), expectedAddress)
  })

  it('SHA256 precompile matches noble', async () => {
    const nobleCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Petersburg })
    const wasmCommon = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Petersburg,
      customCrypto: await wasmCustomCrypto(),
    })

    const nobleEvm = await createEVM({ common: nobleCommon })
    const wasmEvm = await createEVM({ common: wasmCommon })

    const nobleResult = precompile02({
      data: SHA256_INPUT,
      gasLimit: BigInt(0xffff),
      common: nobleCommon,
      _EVM: nobleEvm as EVM,
    })
    const wasmResult = precompile02({
      data: SHA256_INPUT,
      gasLimit: BigInt(0xffff),
      common: wasmCommon,
      _EVM: wasmEvm as EVM,
    })

    assert.strictEqual(bytesToHex(wasmResult.returnValue), bytesToHex(nobleResult.returnValue))
  })
})
