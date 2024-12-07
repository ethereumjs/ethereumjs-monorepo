import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { StatefulVerkleStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToBytes,
  createAccount,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import { VerkleAccessWitness, createEVM } from '../src/index.js'

describe('verkle tests', () => {
  it('should execute bytecode and update the state', async () => {
    // This tests executes some very simple bytecode that stores the value 1 in slot 2
    const common = new Common({
      chain: Mainnet,
      customCrypto: { verkle },
      eips: [6800],
      hardfork: Hardfork.Cancun,
    })
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ common, trie })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xffffffffn })
    await sm.putAccount(address, account)
    const evm = await createEVM({ common, stateManager: sm })
    // Initialize verkleAccess Witness manually (in real context, it is done by the VM, but we are bypassing that here)
    evm.verkleAccessWitness = new VerkleAccessWitness({
      verkleCrypto: verkle,
    })
    const code = hexToBytes('0x6001600255') // PUSH1 01 PUSH1 02 SSTORE
    const res = await evm.runCall({
      code,
      caller: address,
      to: address,
    })
    assert.deepEqual(res.execResult.returnValue, new Uint8Array())
    const retrievedValue = await sm.getStorage(address, setLengthLeft(bigIntToBytes(2n), 32))
    assert.deepEqual(retrievedValue, setLengthLeft(bigIntToBytes(1n), 32))
  })
  it('should revert and access witness should not contain a write access due to OOG', async () => {
    // This tests executes some very simple bytecode that stores the value 1 in slot 2
    const common = new Common({
      chain: Mainnet,
      customCrypto: { verkle },
      eips: [6800],
      hardfork: Hardfork.Cancun,
    })
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ common, trie })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xffffffffn })
    await sm.putAccount(address, account)
    const evm = await createEVM({ common, stateManager: sm })
    // Initialize verkleAccess Witness manually (in real context, it is done by the VM, but we are bypassing that here)
    evm.verkleAccessWitness = new VerkleAccessWitness({
      verkleCrypto: verkle,
    })
    const code = hexToBytes('0x6001600255') // PUSH1 01 PUSH1 02 SSTORE
    const res = await evm.runCall({
      code,
      caller: address,
      to: address,
      gasLimit: BigInt(5), // too little gas for bytecode
      gasPrice: BigInt(1),
    })
    const writtenChunks = Array.from(evm.verkleAccessWitness.chunks.entries()).filter(
      ([_, chunk]) => chunk.write !== undefined,
    )
    assert.ok(writtenChunks.length === 0)
    assert.equal(res.execResult.exceptionError?.error, 'out of gas')
  })
  it('access witness should contain a write access', async () => {
    // This tests executes some very simple bytecode that stores the value 1 in slot 2
    const common = new Common({
      chain: Mainnet,
      customCrypto: { verkle },
      eips: [6800],
      hardfork: Hardfork.Cancun,
    })
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ common, trie })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xffffffffn })
    await sm.putAccount(address, account)
    const evm = await createEVM({ common, stateManager: sm })
    // Initialize verkleAccess Witness manually (in real context, it is done by the VM, but we are bypassing that here)
    evm.verkleAccessWitness = new VerkleAccessWitness({
      verkleCrypto: verkle,
    })
    const code = hexToBytes('0x6001600255') // PUSH1 01 PUSH1 02 SSTORE
    const res = await evm.runCall({
      code,
      caller: address,
      to: address,
      gasLimit: BigInt(21000), // sufficient gas for bytecode
      gasPrice: BigInt(1),
    })
    const writtenChunks = Array.from(evm.verkleAccessWitness.chunks.entries()).filter(
      ([_, chunk]) => chunk.write !== undefined,
    )
    assert.ok(writtenChunks.length === 1)
    assert.equal(res.execResult.exceptionError?.error, undefined)
  })
})
