import tape from 'tape'
import {
  Account,
  Address,
  BN,
  toBuffer,
  keccak256,
  KECCAK256_RLP,
  KECCAK256_RLP_S,
  unpadBuffer,
  zeros,
} from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '../../../src/state'
import { getSingleFile } from '../../tester/testLoader'
import { isRunningInKarma } from '../../util'
import { createAccount } from '../utils'
import { SecureTrie } from 'merkle-patricia-tree'

const StateManager = DefaultStateManager

tape('StateManager - Contract code', (tester) => {
  const it = tester.test
  it('should report data equal to geth output for EIP 1178 proofs - nonexistent account', async (t) => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = new Address(Buffer.from('2D80502854FC7304c3E3457084DE549f5016B73f', 'hex'))
    const ropstenData = require('./testdata_contractWithStorage.json')
    const trie = new SecureTrie()
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Buffer | undefined
    for (const proofData of ropstenData.accountProof) {
      const bufferData = Buffer.from(proofData.slice(2), 'hex')
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.db.put(key, bufferData)
    }
    const storageRoot = ropstenData.storageHash
    const storageTrie = new SecureTrie()
    const storageKeys: Buffer[] = []
    for (const storageProofsData of ropstenData.storageProof) {
      storageKeys.push(Buffer.from(storageProofsData.key.slice(2), 'hex'))
      for (const storageProofData of storageProofsData.proof) {
        const key = keccak256(Buffer.from(storageProofData.slice(2), 'hex'))
        await storageTrie.db.put(key, Buffer.from(storageProofData.slice(2), 'hex'))
      }
    }
    storageTrie.root = Buffer.from(storageRoot.slice(2), 'hex')
    const addressHex = address.buf.toString('hex')
    stateManager._storageTries[addressHex] = storageTrie
    trie.root = stateRoot!

    const proof = await stateManager.getProof(address, storageKeys)
    t.deepEqual(ropstenData, proof)
    await stateManager.verifyProof(ropstenData)
    t.end()
  })
})
