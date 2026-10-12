import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  Account,
  bytesToUnprefixedHex,
  createAddressFromString,
  hexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bench, describe } from 'vitest'

import { createEVM, getActivePrecompiles } from '../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })

/** Tight ADD loop (256 iterations). */
const ARITHMETIC_CODE = hexToBytes(`0x${'600160015801600257'.repeat(32)}00`)

/** PUSH32 .. KECCAK256 POP */
const KECCAK_CODE = hexToBytes(`0x7f${'ab'.repeat(32)}20${'50'.repeat(8)}`)

/** Warm SLOAD on slot 0. */
const WARM_SLOAD_CODE = hexToBytes('0x600054505050505050505050')

/** Warm SSTORE slot 0 <- 1. */
const WARM_SSTORE_CODE = hexToBytes('0x600160005500600055')

const contract = createAddressFromString('0x' + 'cc'.repeat(20))
const caller = createAddressFromString('0x' + 'ee'.repeat(20))

const evm = await createEVM({ common })
const precompiles = getActivePrecompiles(common)
const sha256Pre = precompiles.get('0000000000000000000000000000000000000002')!
const modexpPre = precompiles.get('0000000000000000000000000000000000000005')!
const bn254AddPre = precompiles.get('0000000000000000000000000000000000000006')!
const bn254MulPre = precompiles.get('0000000000000000000000000000000000000007')!

const SHA256_INPUT = hexToBytes(`0x${'ab'.repeat(32)}`)
const MODEXP_INPUT = hexToBytes(
  '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
)

const warmStorageEvm = await createEVM({ common })
await warmStorageEvm.stateManager.putAccount(contract, new Account(undefined, BigInt(1e18)))
await warmStorageEvm.stateManager.putCode(contract, WARM_SLOAD_CODE)
await warmStorageEvm.stateManager.putStorage(contract, new Uint8Array(32), hexToBytes('0x01'))

describe('evm', () => {
  bench('evm arithmetic loop', async () => {
    await evm.runCode!({
      code: ARITHMETIC_CODE,
      gasLimit: BigInt(1_000_000),
    })
  })

  bench('evm keccak256 opcode', async () => {
    await evm.runCode!({
      code: KECCAK_CODE,
      gasLimit: BigInt(1_000_000),
    })
  })

  bench('evm warm sload', async () => {
    await warmStorageEvm.runCode!({
      code: WARM_SLOAD_CODE,
      to: contract,
      gasLimit: BigInt(1_000_000),
    })
  })

  bench('evm warm sstore', async () => {
    const local = await createEVM({ common })
    await local.stateManager.putAccount(contract, new Account(undefined, BigInt(1e18)))
    await local.stateManager.putCode(contract, WARM_SSTORE_CODE)
    await local.runCode!({
      code: WARM_SSTORE_CODE,
      to: contract,
      gasLimit: BigInt(1_000_000),
    })
  })

  bench('evm call opcode', async () => {
    const target = createAddressFromString('0x' + 'dd'.repeat(20))
    const local = await createEVM({ common })
    await local.stateManager.putAccount(caller, new Account(undefined, BigInt(1e18)))
    const callCode = hexToBytes(`0x73${target.toString().slice(2)}6000600060006000600061fffff1`)
    await local.runCode!({
      caller,
      code: callCode,
      gasLimit: BigInt(1_000_000),
    })
  })

  bench('evm sha256 precompile', async () => {
    await sha256Pre({
      data: SHA256_INPUT,
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })
  })

  bench('evm modexp precompile', async () => {
    await modexpPre({
      data: MODEXP_INPUT,
      gasLimit: BigInt(0xffff_ffff),
      common,
      _EVM: evm,
    })
  })

  bench('evm bn254 add precompile', async () => {
    await bn254AddPre({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })
  })

  bench('evm bn254 mul precompile', async () => {
    await bn254MulPre({
      data: new Uint8Array(0),
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })
  })

  bench('evm ecrecover precompile', async () => {
    const prefix = bytesToUnprefixedHex(utf8ToBytes('\x19Ethereum Signed Message:\n32'))
    const hash = '852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46'
    const v = '000000000000000000000000000000000000000000000000000000000000001b'
    const r = 'b814eaab5953337fed2cf504a5b887cddd65a54b7429d7b191ff1331ca0726b1'
    const s = '264de2660d307112075c15f08ba9c25c9a0cc6f8119aff3e7efb0a942773abb0'
    const prefixedMessage = bytesToUnprefixedHex(keccak_256(hexToBytes(`0x${prefix}${hash}`)))
    const data = hexToBytes(`0x${prefixedMessage}${v}${r}${s}`)
    const addressStr = '0000000000000000000000000000000000000001'
    const ecrecoverPre = precompiles.get(addressStr)!
    await ecrecoverPre({
      data,
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })
  })
})
