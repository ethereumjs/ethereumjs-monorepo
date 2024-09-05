import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { AccessWitness, StatefulVerkleStateManager } from '@ethereumjs/statemanager'
import { createAccount, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createEVM } from '../src/index.js'

import type { VerkleCrypto } from '@ethereumjs/util'

describe('verkle tests', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('should execute bytecode and update the state', async () => {
    const common = new Common({ chain: Mainnet, eips: [6800], hardfork: Hardfork.Cancun })
    const trie = await createVerkleTree()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')
    const account = createAccount({ nonce: 3n, balance: 0xffffffffn })
    await sm.putAccount(address, account)
    const evm = await createEVM({ common, stateManager: sm })
    const code = hexToBytes('0x6001600255')
    const accessWitness = new AccessWitness({ verkleCrypto })
    const res = await evm.runCall({ code, caller: address, accessWitness })
    assert.equal(res.execResult.returnValue, new Uint8Array())
  })
})
