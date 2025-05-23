import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import { eip4844GethGenesis } from '@ethereumjs/testdata'
import {
  Account,
  Address,
  MAX_UINT64,
  bytesToBigInt,
  bytesToHex,
  bytesToUnprefixedHex,
  concatBytes,
  createAddressFromPrivateKey,
  createAddressFromString,
  createZeroAddress,
  hexToBytes,
  intToBytes,
  padToEven,
  setLengthLeft,
  setLengthRight,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { assert, describe, it } from 'vitest'

import { EVMError } from '../src/errors.ts'
import { defaultBlock } from '../src/evm.ts'
import { createEVM } from '../src/index.ts'

import type { EVMRunCallOpts } from '../src/types.ts'

// Non-protected Create2Address generator. Does not check if Uint8Arrays have the right padding.
function create2address(sourceAddress: Address, codeHash: Uint8Array, salt: Uint8Array): Address {
  const rlp_proc_bytes = hexToBytes('0xff')
  const hashBytes = concatBytes(rlp_proc_bytes, sourceAddress.bytes, salt, codeHash)
  return new Address(keccak256(hashBytes).slice(12))
}

describe('RunCall tests', () => {
  it('Create where FROM account nonce is 0', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
    const evm = await createEVM({ common })

    const deployMentSizeHex = `62${bytesToUnprefixedHex(setLengthLeft(hexToBytes('0x6000'), 3))}`
    const deployContractCode = hexToBytes(`0x305F52${deployMentSizeHex}5FF3`)

    const depSize = deployContractCode.length
    const pushCodeSize = bytesToUnprefixedHex(new Uint8Array([0x60, depSize]))

    const deploymentCodeMSTORE = `7F${bytesToUnprefixedHex(setLengthRight(deployContractCode, 32))}5F52`

    // calldataload [0] is salt
    const code = hexToBytes(
      `0x${deploymentCodeMSTORE}${'5F355B'}${'60010180'}${pushCodeSize}5F5F${'F5602557'}`,
    )

    // evm.events.on('step', (e) => {console.log(e.opcode.name)})

    const res = await evm.runCall({ to: undefined, gasLimit: BigInt(30_000_000), data: code })

    const addr = res.createdAddress!.bytes
    const deploymentHash = keccak256(deployContractCode)

    // CREATE2 layout for the hasher
    // [0-0] 0xff
    // [1-21] address [20bytes]
    // [22-54] salt [32 bytes]
    // [55-85] codeHash [32 bytes]

    const attackCode = `0x7FFF${bytesToUnprefixedHex(setLengthRight(addr, 31))}5F527F${bytesToUnprefixedHex(deploymentHash)}6035525F5B6001018060155260555F203B50604856`

    const ctrAddress = createAddressFromString('0x' + '20'.repeat(20))
    await evm.stateManager.putCode(ctrAddress, hexToBytes(<any>attackCode))

    const res2 = await evm.runCall({ to: ctrAddress, gasLimit: BigInt(30_000_000), data: code })
  }, 10000000)
})
