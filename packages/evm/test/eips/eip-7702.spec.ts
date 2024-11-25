import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  Address,
  bytesToBigInt,
  equalsBytes,
  hexToBytes,
  setLengthRight,
  unprefixedHexToBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../../src/index.js'

const eip7702Designator = hexToBytes('0xef01')
const addressHex = '01'.repeat(20) // Address as unprefixed hex string
const address = new Address(unprefixedHexToBytes(addressHex))

const delegationCode = hexToBytes('0xef0100' + addressHex) // This code will delegate to `address`

// Helpers for unprefixed hex strings of opcodes
const EXTCODESIZE = '3B'
const EXTCODECOPY = '3C'
const EXTCODEHASH = '3F'

// This code stores the topmost stack item in slot 0
const STORE_TOP_STACK_CODE = '5F55'

// This code pushes the `address` to the stack
const PUSH_Address = '73' + addressHex // PUSH20 <address> as unprefixed hex string

const testCodeAddress = new Address(unprefixedHexToBytes('02'.repeat(20)))

// Setups EVM with an account at `address` which is delegated to itself
async function getEVM() {
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Prague,
  })
  const evm = await createEVM({
    common,
  })
  await evm.stateManager.putCode(address, delegationCode)
  return evm
}

describe('EIP 7702 tests', () => {
  it('EXTCODESIZE', async () => {
    const evm = await getEVM()
    const code = unprefixedHexToBytes(PUSH_Address + EXTCODESIZE + STORE_TOP_STACK_CODE)
    await evm.stateManager.putCode(testCodeAddress, code)

    await evm.runCall({
      to: testCodeAddress,
      gasLimit: BigInt(100_000),
    })

    const result = await evm.stateManager.getStorage(testCodeAddress, new Uint8Array(32))
    const expected = BigInt(eip7702Designator.length)

    assert.equal(bytesToBigInt(result), expected)
  })

  it('EXTCODEHASH', async () => {
    const evm = await getEVM()
    const code = unprefixedHexToBytes(PUSH_Address + EXTCODEHASH + STORE_TOP_STACK_CODE)
    await evm.stateManager.putCode(testCodeAddress, code)

    await evm.runCall({
      to: testCodeAddress,
      gasLimit: BigInt(100_000),
    })

    const result = await evm.stateManager.getStorage(testCodeAddress, new Uint8Array(32))
    const expected = keccak256(eip7702Designator)

    assert.ok(equalsBytes(result, expected))
  })

  it('EXTCODECOPY', async () => {
    const evm = await getEVM()
    // This code does some extra logic than other tests, because it has to setup EXTCODECOPY (4 stack items instead of 1)
    // It EXTCODECOPYs 32 bytes of the delegated address in memory at key 0, and then MLOADs key 0 before storing the result
    const code = unprefixedHexToBytes(
      '60205F5F' + PUSH_Address + EXTCODECOPY + '5F51' + STORE_TOP_STACK_CODE,
    )
    await evm.stateManager.putCode(testCodeAddress, code)

    await evm.runCall({
      to: testCodeAddress,
      gasLimit: BigInt(100_000),
    })

    const result = await evm.stateManager.getStorage(testCodeAddress, new Uint8Array(32))
    const expected = setLengthRight(eip7702Designator, 32)

    assert.ok(equalsBytes(result, expected))
  })
})
