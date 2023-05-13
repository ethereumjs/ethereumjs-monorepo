import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address, unpadBytes } from '@ethereumjs/util'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { EVM } from '../src'

import type { EVMRunCallOpts } from '../src/types'

tape('DATAHASH / access versionedHashes in calldata', async (t) => {
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

  const getDataHashIndex0Code = '60004960005260206000F3'
  // setup the call arguments
  const runCallArgs: EVMRunCallOpts = {
    gasLimit: BigInt(0xffffffffff),
    // calldata -- retrieves the versioned hash at index 0 and returns it from memory
    data: hexToBytes(getDataHashIndex0Code),
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

tape('DATAHASH: access versionedHashes in static call', async (t) => {
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

  const getDataHashIndex0Code = '60004960005260206000F3'
  const contractAddress = new Address(hexToBytes('00000000000000000000000000000000000000ff')) // contract address
  await evm.stateManager.putContractCode(contractAddress, hexToBytes(getDataHashIndex0Code)) // setup the contract code

  const caller = new Address(hexToBytes('00000000000000000000000000000000000000ee')) // caller address
  await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111))) // give the calling account a big balance so we don't run out of funds

  // Call the contract via static call and return the returned DATAHASH
  const staticCallCode =
    // return, args and value
    '5F' +
    '5F' +
    '5F' +
    '5F' +
    '5F' +
    // push 20 bytes address of contract to call
    '73' +
    '00000000000000000000000000000000000000FF' +
    // push whatever gas is available and static call
    '5A' +
    'FA' +
    // Copy returndata to memory offset and then return the same
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
    'retrieved correct versionedHash from runState'
  )
  t.end()
})
