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
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { VerkleAccessWitness, createEVM } from '../src/index.js'

import type { VerkleCrypto } from '@ethereumjs/util'

describe('verkle tests', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('should execute bytecode and update the state', async () => {
    // This tests executes some very simple bytecode that stores the value 1 in slot 2
    const common = new Common({ chain: Mainnet, eips: [6800], hardfork: Hardfork.Cancun })
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xffffffffn })
    await sm.putAccount(address, account)
    const evm = await createEVM({ common, stateManager: sm })
    // Initialize verkleAccess Witness manually (in real context, it is done by the VM, but we are bypassing that here)
    evm.verkleAccessWitness = new VerkleAccessWitness({ verkleCrypto })
    const code = hexToBytes('0x6001600255') // PUSH1 01 PUSH1 02 SSTORE
    const res = await evm.runCall({
      code,
      caller: address,
      to: address,
    })
    assert.deepEqual(res.execResult.returnValue, new Uint8Array())
    const retrievedValue = await sm.getStorage(address, setLengthLeft(bigIntToBytes(2n), 32))
    assert.deepEqual(retrievedValue, bigIntToBytes(1n))
  })
})
