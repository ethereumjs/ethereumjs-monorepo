import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  Account,
  Address,
  MAX_UINT64,
  bytesToHex,
  concatBytes,
  hexToBytes,
  padToEven,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { EVMError } from '../src/errors.ts'
import { createEVM } from '../src/index.ts'

function create2address(sourceAddress: Address, codeHash: Uint8Array, salt: Uint8Array): Address {
  const rlp_proc_bytes = hexToBytes('0xff')
  const hashBytes = concatBytes(rlp_proc_bytes, sourceAddress.bytes, salt, codeHash)
  return new Address(keccak_256(hashBytes).slice(12))
}

describe('[EVM/runCall]: CREATE and CREATE2', () => {
  it('creates a valid address when FROM account nonce is 0', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Constantinople })
    const evm = await createEVM({ common })
    const res = await evm.runCall({ to: undefined })
    assert.strictEqual(res.createdAddress?.toString(), '0xbd770416a3345f91e4b34576cb804a576fa48eb1')
  })

  it('EIP-1014 CREATE2 creates contracts at the expected address', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const contractAddress = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Constantinople })
    const evm = await createEVM({ common })
    const code = '0x3460008080F560005260206000F3'

    await evm.stateManager.putCode(contractAddress, hexToBytes(code))
    await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111)))
    const codeHash = keccak_256(new Uint8Array())
    for (let value = 0; value <= 1000; value += 20) {
      const runCallArgs = {
        caller,
        gasLimit: BigInt(0xffffffffff),
        to: contractAddress,
        value: BigInt(value),
      }

      let valueBytes = hexToBytes(`0x${padToEven(value.toString(16))}`)
      if (valueBytes.length < 32) {
        const diff = 32 - valueBytes.length
        valueBytes = concatBytes(new Uint8Array(diff), valueBytes)
      }
      const expectedAddress = create2address(contractAddress, codeHash, valueBytes)
      const res = await evm.runCall(runCallArgs)
      const executionReturnValue = new Address(res.execResult.returnValue.slice(12))
      if (!expectedAddress.equals(executionReturnValue)) {
        assert.fail('contract address not equal')
      }
    }
  })

  it('EIP-2681 rejects CREATE when creator nonce is MAX_UINT64', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const slot = hexToBytes(`0x${'00'.repeat(32)}`)
    const emptyBytes = hexToBytes('0x')
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const evm = await createEVM({ common })
    const code = '0x60008080F060005500'

    await evm.stateManager.putCode(address, hexToBytes(code))

    const account = await evm.stateManager.getAccount(address)
    account!.nonce = MAX_UINT64 - BigInt(1)
    await evm.stateManager.putAccount(address, account!)

    const runCallArgs = {
      caller,
      to: address,
      gasLimit: BigInt(0xffffffffff),
    }

    await evm.runCall(runCallArgs)
    let storage = await evm.stateManager.getStorage(address, slot)
    assert.notDeepEqual(storage, emptyBytes)

    await evm.runCall(runCallArgs)
    storage = await evm.stateManager.getStorage(address, slot)
    assert.deepEqual(storage, emptyBytes)
  })
})

describe('[EVM/runCall]: code deposit', () => {
  it('reports CODESIZE_EXCEEDS_MAXIMUM when return data exceeds max code size', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
    const evm = await createEVM({ common })

    const result = await evm.runCall({
      caller,
      gasLimit: BigInt(0xffffffffff),
      data: hexToBytes('0x62FFFFFF6000F3'),
    })
    assert.strictEqual(
      result.execResult.exceptionError?.error,
      EVMError.errorMessages.CODESIZE_EXCEEDS_MAXIMUM,
    )
  })

  it('reports CODESIZE_EXCEEDS_MAXIMUM or OUT_OF_GAS on Homestead and later', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })
    const evm = await createEVM({ common })

    const res = await evm.runCall({
      gasLimit: BigInt(10000000),
      data: hexToBytes('0x61FFFF6000F3'),
    })
    assert.strictEqual(
      res.execResult.exceptionError?.error,
      EVMError.errorMessages.CODESIZE_EXCEEDS_MAXIMUM,
    )

    const res2 = await evm.runCall({
      gasLimit: BigInt(100000),
      data: hexToBytes('0x62FFFFFF6000F3'),
    })
    assert.strictEqual(res2.execResult.exceptionError?.error, EVMError.errorMessages.OUT_OF_GAS)
  })

  it('reports CODESTORE_OUT_OF_GAS or OUT_OF_GAS on Frontier', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
    const evm = await createEVM({ common })

    const res = await evm.runCall({
      gasLimit: BigInt(10000000),
      data: hexToBytes('0x61FFFF6000F3'),
    })
    assert.strictEqual(
      res.execResult.exceptionError?.error,
      EVMError.errorMessages.CODESTORE_OUT_OF_GAS,
    )

    const res2 = await evm.runCall({
      gasLimit: BigInt(100000),
      data: hexToBytes('0x62FFFFFF6000F3'),
    })
    assert.strictEqual(res2.execResult.exceptionError?.error, EVMError.errorMessages.OUT_OF_GAS)
  })
})

describe('[EVM/runCall]: precompiles', () => {
  it('IDENTITY precompile copies memory on the Geth chain-split replay', async () => {
    const caller = new Address(hexToBytes('0x1a02a619e51cc5f8a2a61d2a60f6c80476ee8ead'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const evm = await createEVM({ common })
    const code = '0x3034526020600760203460045afa602034343e604034f3'

    const account = new Account()
    account!.nonce = BigInt(1)
    account!.balance = BigInt(10000000000000000)
    await evm.stateManager.putAccount(caller, account!)

    const result = await evm.runCall({
      caller,
      gasLimit: BigInt(150000),
      data: hexToBytes(code),
      gasPrice: BigInt(70000000000),
    })
    const expectedAddress = '0x28373a29d17af317e669579d97e7dddc9da6e3e2'
    const expectedCode =
      '0x00000000000000000000000028373a29d17af317e669579d97e7dddc9da6e3e2e7dddc9da6e3e200000000000000000000000000000000000000000000000000'

    assert.strictEqual(result.createdAddress?.toString(), expectedAddress)
    const deployedCode = await evm.stateManager.getCode(result.createdAddress!)
    assert.strictEqual(bytesToHex(deployedCode), expectedCode)
  })
})
