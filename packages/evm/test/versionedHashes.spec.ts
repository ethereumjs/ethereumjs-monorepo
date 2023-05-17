import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address, unpadBytes } from '@ethereumjs/util'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { EVM } from '../src'

import type { EVMRunCallOpts } from '../src/types'

tape('BLOBHASH / access versionedHashes in calldata', async (t) => {
  // setup the evm
  const genesisJSON = require('../../client/test/testdata/geth-genesis/eip4844.json')
  const common = Common.fromGethGenesis(genesisJSON, {
    chain: 'custom',
    hardfork: Hardfork.Cancun,
  })
  const evm = await EVM.create({
    common,
    stateManager: new DefaultStateManager(),
  })

  const getBlobHashIndex0Code = '60004960005260206000F3'
  // setup the call arguments
  const runCallArgs: EVMRunCallOpts = {
    gasLimit: BigInt(0xffffffffff),
    // calldata -- retrieves the versioned hash at index 0 and returns it from memory
    data: hexToBytes(getBlobHashIndex0Code),
    versionedHashes: [hexToBytes('ab')],
  }
  const res = await evm.runCall(runCallArgs)

  t.equal(
    bytesToHex(unpadBytes(res.execResult.returnValue)),
    'ab',
    'retrieved correct versionedHash from runState'
  )
  t.end()
})

tape(`BLOBHASH: access versionedHashes within contract calls`, async (t) => {
  // setup the evm
  const genesisJSON = require('../../client/test/testdata/geth-genesis/eip4844.json')
  const common = Common.fromGethGenesis(genesisJSON, {
    chain: 'custom',
    hardfork: Hardfork.Cancun,
  })
  const evm = await EVM.create({
    common,
    stateManager: new DefaultStateManager(),
  })

  const getBlobHasIndexCode = '60004960005260206000F3'
  const contractAddress = new Address(hexToBytes('00000000000000000000000000000000000000ff')) // contract address
  await evm.stateManager.putContractCode(contractAddress, hexToBytes(getBlobHasIndexCode)) // setup the contract code

  const caller = new Address(hexToBytes('00000000000000000000000000000000000000ee')) // caller address
  await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111))) // give the calling account a big balance so we don't run out of funds

  for (const callCode of ['F1', 'F4', 'F2', 'FA']) {
    // Call the contract via static call and return the returned BLOBHASH
    const staticCallCode =
      // return, args and value
      '5F5F5F5F5F' +
      // push 20 bytes address of contract to call
      '7300000000000000000000000000000000000000FF' +
      // push whatever gas is available and add the call
      '5A' +
      callCode +
      // copy returndata to memory offset and then return the same
      '60205F5F3E60206000F3'

    // setup the call arguments
    const runCallArgs: EVMRunCallOpts = {
      gasLimit: BigInt(0xffffffffff),
      // calldata -- retrieves the versioned hash at index 0 and returns it from memory
      data: hexToBytes(staticCallCode),
      versionedHashes: [hexToBytes('ab')],
    }
    const res = await evm.runCall(runCallArgs)

    t.equal(
      bytesToHex(unpadBytes(res.execResult.returnValue)),
      'ab',
      `retrieved correct versionedHash from runState through callCode=${callCode}`
    )
  }
  t.end()
})

tape(`BLOBHASH: access versionedHashes in a CREATE/CREATE2 frame`, async (t) => {
  // setup the evm
  const genesisJSON = require('../../client/test/testdata/geth-genesis/eip4844.json')
  const common = Common.fromGethGenesis(genesisJSON, {
    chain: 'custom',
    hardfork: Hardfork.Cancun,
  })
  const evm = await EVM.create({
    common,
    stateManager: new DefaultStateManager(),
  })

  let getBlobHashIndex0Code = '60004960005260206000F3'
  getBlobHashIndex0Code = getBlobHashIndex0Code.padEnd(64, '0')

  const caller = new Address(hexToBytes('00000000000000000000000000000000000000ee')) // caller address
  await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111))) // give the calling account a big balance so we don't run out of funds

  for (const createOP of ['F0', 'F5']) {
    // Call the contract via static call and return the returned BLOBHASH
    const staticCallCode =
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
      '5F5260206000F3'

    // setup the call arguments
    const runCallArgs: EVMRunCallOpts = {
      gasLimit: BigInt(0xffffffffff),
      // calldata -- retrieves the versioned hash at index 0 and returns it from memory
      data: hexToBytes(staticCallCode),
      versionedHashes: [hexToBytes('ab')],
    }
    const res = await evm.runCall(runCallArgs)

    const address = Address.fromString('0x' + bytesToHex(res.execResult.returnValue.slice(12)))
    const code = await evm.stateManager.getContractCode(address)

    t.equal(
      bytesToHex(code),
      'ab'.padStart(64, '0'), // have to padStart here, since `BLOBHASH` will push 32 bytes on stack
      `retrieved correct versionedHash from runState through createOP=${createOP}`
    )
  }
  t.end()
})
