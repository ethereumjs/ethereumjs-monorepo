import tape from 'tape'
import { Address, keccak256, toBuffer, zeros } from 'ethereumjs-util'
import { SecureTrie } from 'merkle-patricia-tree'
import { DefaultStateManager } from '../../src'
import ropsten_validAccount from './testdata/ropsten_validAccount.json'
import ropsten_nonexistentAccount from './testdata/ropsten_nonexistentAccount.json'
import ropsten_contractWithStorage from './testdata/ropsten_contractWithStorage.json'

tape('ProofStateManager', (t) => {
  t.test('should get and verify EIP 1178 proofs', async (st) => {
    const address = Address.zero()
    const key = zeros(32)
    const value = Buffer.from('0000aabb00', 'hex')
    const code = Buffer.from('6000', 'hex')
    const stateManager = new DefaultStateManager()
    await stateManager.checkpoint()
    await stateManager.putContractStorage(address, key, value)
    await stateManager.putContractCode(address, code)
    const account = await stateManager.getAccount(address)
    account.balance = BigInt(1)
    account.nonce = BigInt(2)
    await stateManager.putAccount(address, account)
    const address2 = new Address(Buffer.from('20'.repeat(20), 'hex'))
    const account2 = await stateManager.getAccount(address2)
    account.nonce = BigInt(2)
    await stateManager.putAccount(address2, account2)
    await stateManager.commit()
    await stateManager.flush()

    const proof = await stateManager.getProof(address, [key])
    st.ok(await stateManager.verifyProof(proof))
    st.end()
  })

  t.test('should report data equal to geth output for EIP 1178 proofs', async (st) => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // Block: 11098094 (hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146)
    // Account: 0xc626553e7c821d0f8308c28d56c60e3c15f8d55a
    // Storage slots: empty list
    const address = Address.fromString('0xc626553e7c821d0f8308c28d56c60e3c15f8d55a')
    const trie = new SecureTrie()
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Buffer | undefined
    for (const proofData of ropsten_validAccount.accountProof) {
      const bufferData = toBuffer(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.db.put(key, bufferData)
    }
    trie.root = stateRoot!
    const proof = await stateManager.getProof(address)
    st.deepEqual(ropsten_validAccount, proof)
    st.ok(await stateManager.verifyProof(ropsten_validAccount))
    st.end()
  })

  t.test(
    'should report data equal to geth output for EIP 1178 proofs - nonexistent account',
    async (st) => {
      // Data source: Ropsten, retrieved with Geth eth_getProof
      // Block: 11098094 (hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146)
      // Account: 0x68268f12253f69f66b188c95b8106b2f847859fc (this account does not exist)
      // Storage slots: empty list
      const address = Address.fromString('0x68268f12253f69f66b188c95b8106b2f847859fc')
      const trie = new SecureTrie()
      const stateManager = new DefaultStateManager({ trie })
      // Dump all the account proof data in the DB
      let stateRoot: Buffer | undefined
      for (const proofData of ropsten_nonexistentAccount.accountProof) {
        const bufferData = toBuffer(proofData)
        const key = keccak256(bufferData)
        if (stateRoot === undefined) {
          stateRoot = key
        }
        await trie.db.put(key, bufferData)
      }
      trie.root = stateRoot!
      const proof = await stateManager.getProof(address)
      st.deepEqual(ropsten_nonexistentAccount, proof)
      st.ok(await stateManager.verifyProof(ropsten_nonexistentAccount))
      st.end()
    }
  )

  t.test(
    'should report data equal to geth output for EIP 1178 proofs - account with storage',
    async (st) => {
      // Data source: Ropsten, retrieved with Geth eth_getProof
      // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
      // Note: the first slot has a value, but the second slot is empty
      // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
      const address = Address.fromString('0x2D80502854FC7304c3E3457084DE549f5016B73f')
      const trie = new SecureTrie()
      const stateManager = new DefaultStateManager({ trie })
      // Dump all the account proof data in the DB
      let stateRoot: Buffer | undefined
      for (const proofData of ropsten_contractWithStorage.accountProof) {
        const bufferData = toBuffer(proofData)
        const key = keccak256(bufferData)
        if (stateRoot === undefined) {
          stateRoot = key
        }
        await trie.db.put(key, bufferData)
      }
      const storageRoot = ropsten_contractWithStorage.storageHash
      const storageTrie = new SecureTrie()
      const storageKeys: Buffer[] = []
      for (const storageProofsData of ropsten_contractWithStorage.storageProof) {
        storageKeys.push(toBuffer(storageProofsData.key))
        for (const storageProofData of storageProofsData.proof) {
          const key = keccak256(toBuffer(storageProofData))
          await storageTrie.db.put(key, toBuffer(storageProofData))
        }
      }
      storageTrie.root = toBuffer(storageRoot)
      const addressHex = address.buf.toString('hex')
      stateManager._storageTries[addressHex] = storageTrie
      trie.root = stateRoot!

      const proof = await stateManager.getProof(address, storageKeys)
      st.deepEqual(ropsten_contractWithStorage, proof)
      await stateManager.verifyProof(ropsten_contractWithStorage)
      st.end()
    }
  )

  t.test('should throw on invalid proofs - existing accounts/slots', async (st) => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = Address.fromString('0x2D80502854FC7304c3E3457084DE549f5016B73f')
    const trie = new SecureTrie()
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Buffer | undefined
    for (const proofData of ropsten_contractWithStorage.accountProof) {
      const bufferData = toBuffer(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.db.put(key, bufferData)
    }
    const storageRoot = ropsten_contractWithStorage.storageHash
    const storageTrie = new SecureTrie()
    const storageKeys: Buffer[] = []
    for (const storageProofsData of ropsten_contractWithStorage.storageProof) {
      storageKeys.push(toBuffer(storageProofsData.key))
      for (const storageProofData of storageProofsData.proof) {
        const key = keccak256(toBuffer(storageProofData))
        await storageTrie.db.put(key, toBuffer(storageProofData))
      }
    }
    storageTrie.root = toBuffer(storageRoot)
    const addressHex = address.buf.toString('hex')
    stateManager._storageTries[addressHex] = storageTrie
    trie.root = stateRoot!

    // tamper with account data
    const testdata = ropsten_contractWithStorage as any
    for (const tamper of ['nonce', 'balance', 'codeHash', 'storageHash']) {
      const original = testdata[tamper]
      try {
        const newField = `0x9${original.slice(3)}`
        testdata[tamper] = newField
        await stateManager.verifyProof(testdata)
        // note: this implicitly means that newField != original,
        // if newField == original then the proof would be valid and test would fail
        t.fail('should throw')
      } catch (e) {
        t.pass('threw on invalid proof')
      } finally {
        testdata[tamper] = original
      }
    }

    // tamper with storage slots
    for (const slot of testdata.storageProof) {
      const original = slot.value
      slot.value = `0x9${original.slice(3)}`
      try {
        await stateManager.verifyProof(testdata)
        st.fail('should throw')
      } catch {
        st.pass('threw on invalid proof')
      } finally {
        slot.value = original
      }
    }
    st.end()
  })

  t.test('should throw on invalid proofs - nonexistent account', async (st) => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = Address.fromString('0x68268f12253f69f66b188c95b8106b2f847859fc')
    const trie = new SecureTrie()
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Buffer | undefined
    for (const proofData of ropsten_nonexistentAccount.accountProof) {
      const bufferData = toBuffer(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.db.put(key, bufferData)
    }
    const storageRoot = ropsten_nonexistentAccount.storageHash
    const storageTrie = new SecureTrie()
    storageTrie.root = toBuffer(storageRoot)
    const addressHex = address.buf.toString('hex')
    stateManager._storageTries[addressHex] = storageTrie
    trie.root = stateRoot!

    // tamper with account data
    const testdata = ropsten_nonexistentAccount as any
    for (const tamper of ['nonce', 'balance', 'codeHash', 'storageHash']) {
      const original = testdata[tamper]
      try {
        const newField = `0x9${original.slice(3)}`
        testdata[tamper] = newField
        await stateManager.verifyProof(testdata)
        // note: this implicitly means that newField != original,
        // if newField == original then the proof would be valid and test would fail
        st.fail('should throw')
      } catch (e) {
        st.pass('threw on invalid proof')
      } finally {
        // restore original valid proof
        testdata[tamper] = original
      }
    }
    st.end()
  })
})
