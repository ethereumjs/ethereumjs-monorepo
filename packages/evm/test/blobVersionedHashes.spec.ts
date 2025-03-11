import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import {
  Account,
  Address,
  bytesToHex,
  createAddressFromString,
  hexToBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.js'

import type { EVMRunCallOpts } from '../src/types.js'
import type { PrefixedHexString } from '@ethereumjs/util'

describe('BLOBHASH / access blobVersionedHashes in calldata', () => {
  it('should work', async () => {
    // setup the evm
    const { eip4844Data } = await import('./testdata/eip4844.js')
    const common = createCommonFromGethGenesis(eip4844Data, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
    })
    const evm = await createEVM({
      common,
    })

    const getBlobHashIndex0Code = '0x60004960005260206000F3'
    // setup the call arguments
    const runCallArgs: EVMRunCallOpts = {
      gasLimit: BigInt(0xffffffffff),
      // calldata -- retrieves the versioned hash at index 0 and returns it from memory
      data: hexToBytes(getBlobHashIndex0Code),
      blobVersionedHashes: ['0xab'],
    }
    const res = await evm.runCall(runCallArgs)

    assert.equal(
      bytesToHex(unpadBytes(res.execResult.returnValue)),
      '0xab',
      'retrieved correct versionedHash from runState',
    )
  })
})

describe(`BLOBHASH: access blobVersionedHashes within contract calls`, () => {
  it('should work', async () => {
    // setup the evm
    const { eip4844Data } = await import('./testdata/eip4844.js')
    const common = createCommonFromGethGenesis(eip4844Data, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
    })
    const evm = await createEVM({
      common,
    })

    const getBlobHasIndexCode = '0x60004960005260206000F3'
    const contractAddress = new Address(hexToBytes('0x00000000000000000000000000000000000000ff')) // contract address
    await evm.stateManager.putCode(contractAddress, hexToBytes(getBlobHasIndexCode)) // setup the contract code

    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee')) // caller address
    await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111))) // give the calling account a big balance so we don't run out of funds

    for (const callCode of ['F1', 'F4', 'F2', 'FA']) {
      // Call the contract via static call and return the returned BLOBHASH
      const staticCallCode = ('0x' +
        // return, args and value
        '5F5F5F5F5F' +
        // push 20 bytes address of contract to call
        '7300000000000000000000000000000000000000FF' +
        // push whatever gas is available and add the call
        '5A' +
        callCode +
        // copy returndata to memory offset and then return the same
        '60205F5F3E60206000F3') as PrefixedHexString

      // setup the call arguments
      const runCallArgs: EVMRunCallOpts = {
        gasLimit: BigInt(0xffffffffff),
        // calldata -- retrieves the versioned hash at index 0 and returns it from memory
        data: hexToBytes(staticCallCode),
        blobVersionedHashes: ['0xab'],
      }
      const res = await evm.runCall(runCallArgs)

      assert.equal(
        bytesToHex(unpadBytes(res.execResult.returnValue)),
        '0xab',
        `retrieved correct versionedHash from runState through callCode=${callCode}`,
      )
    }
  })
})

describe(`BLOBHASH: access blobVersionedHashes in a CREATE/CREATE2 frame`, () => {
  it('should work', async () => {
    // setup the evm
    const { eip4844Data } = await import('./testdata/eip4844.js')
    const common = createCommonFromGethGenesis(eip4844Data, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
    })
    const evm = await createEVM({
      common,
    })

    let getBlobHashIndex0Code = '60004960005260206000F3'
    getBlobHashIndex0Code = getBlobHashIndex0Code.padEnd(64, '0')

    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee')) // caller address
    await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111))) // give the calling account a big balance so we don't run out of funds

    for (const createOP of ['F0', 'F5']) {
      // Call the contract via static call and return the returned BLOBHASH
      const staticCallCode = ('0x' +
        // push initcode
        '7F' +
        getBlobHashIndex0Code +
        // push MSTORE offset (0)
        '5F' +
        // MSTORE
        '52' +
        // push [salt, length, offset, value] -> [0, 11, 0, 0]
        '5F600B5F5F' +
        // run CREATE(2)
        createOP +
        // copy the return stack item to memory (this is the created address)
        '5F5260206000F3') as PrefixedHexString

      // setup the call arguments
      const runCallArgs: EVMRunCallOpts = {
        gasLimit: BigInt(0xffffffffff),
        // calldata -- retrieves the versioned hash at index 0 and returns it from memory
        data: hexToBytes(staticCallCode),
        blobVersionedHashes: ['0xab'],
      }
      const res = await evm.runCall(runCallArgs)

      const address = createAddressFromString(bytesToHex(res.execResult.returnValue.slice(12)))
      const code = await evm.stateManager.getCode(address)

      assert.equal(
        bytesToHex(code),
        '0x' + 'ab'.padStart(64, '0'), // have to padStart here, since `BLOBHASH` will push 32 bytes on stack
        `retrieved correct versionedHash from runState through createOP=${createOP}`,
      )
    }
  })
})
