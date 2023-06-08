import { Trie } from '@ethereumjs/trie'
import {
  Account,
  Address,
  bytesToHex,
  hexStringToBytes,
  randomBytes,
  zeros,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

import * as ropsten_contractWithStorage from './testdata/ropsten_contractWithStorage.json'
import * as ropsten_nonexistentAccount from './testdata/ropsten_nonexistentAccount.json'
import * as ropsten_validAccount from './testdata/ropsten_validAccount.json'

tape('ProofStateManager', (t) => {
  t.test('should get and verify EIP 1178 proofs', async (st) => {
    const address = Address.zero()
    const key = zeros(32)
    const value = hexStringToBytes('0000aabb00')
    const code = hexStringToBytes('6000')
    const stateManager = new DefaultStateManager()
    await stateManager.checkpoint()
    await stateManager.putAccount(address, new Account())
    await stateManager.putContractStorage(address, key, value)
    await stateManager.putContractCode(address, code)
    const account = await stateManager.getAccount(address)
    account!.balance = BigInt(1)
    account!.nonce = BigInt(2)
    await stateManager.putAccount(address, account!)
    const address2 = new Address(hexStringToBytes('20'.repeat(20)))
    const account2 = await stateManager.getAccount(address2)
    account!.nonce = BigInt(2)
    await stateManager.putAccount(address2, account2!)
    await stateManager.commit()
    await stateManager.flush()

    const proof = await stateManager.getProof(address, [key])
    st.ok(await stateManager.verifyProof(proof))
    const nonExistenceProof = await stateManager.getProof(Address.fromPrivateKey(randomBytes(32)))
    st.equals(
      await stateManager.verifyProof(nonExistenceProof),
      true,
      'verified proof of non-existence of account'
    )
    st.end()
  })

  t.test('should report data equal to geth output for EIP 1178 proofs', async (st) => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // Block: 11098094 (hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146)
    // Account: 0xc626553e7c821d0f8308c28d56c60e3c15f8d55a
    // Storage slots: empty list
    const address = Address.fromString('0xc626553e7c821d0f8308c28d56c60e3c15f8d55a')
    const trie = await Trie.create({ useKeyHashing: true })
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropsten_validAccount.accountProof) {
      const bufferData = hexStringToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.database().put(key, bufferData)
    }
    await trie.setRootByHash(stateRoot!)
    const proof = await stateManager.getProof(address)
    st.deepEqual(proof, ropsten_validAccount)
    st.ok(
      await stateManager.verifyProof(ropsten_validAccount),
      'verified proof for ropsten_validAccount'
    )
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
      // Dump all the account proof data in the DB
      const trie = await Trie.fromProof(
        ropsten_nonexistentAccount.accountProof.map((proofData) => hexStringToBytes(proofData)),
        { useKeyHashing: true }
      )
      const stateManager = new DefaultStateManager({ trie })
      await stateManager.putAccount(address, new Account())
      const proof = await stateManager.getProof(address)

      st.deepEqual(
        proof,
        ropsten_nonexistentAccount,
        'created proof for ropsten_nonexistentAccount'
      )
      st.ok(
        await stateManager.verifyProof(ropsten_nonexistentAccount),
        'verified proof for ropsten_nonexistentAccount'
      )
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
      const trie = await Trie.fromProof(
        ropsten_contractWithStorage.accountProof.map((p) => hexStringToBytes(p)),
        { useKeyHashing: true }
      )

      const stateManager = new DefaultStateManager({ trie })
      // Dump all the account proof data in the DB
      let stateRoot: Uint8Array | undefined
      for (const proofData of ropsten_contractWithStorage.accountProof) {
        const bufferData = hexStringToBytes(proofData)
        const key = keccak256(bufferData)
        if (stateRoot === undefined) {
          stateRoot = key
        }
      }
      const storageRoot = ropsten_contractWithStorage.storageHash
      const storageTrie = await Trie.fromProof(
        ropsten_contractWithStorage.storageProof[0].proof.map((p) => hexStringToBytes(p)),
        { useKeyHashing: true }
      )
      const storageKeys: Uint8Array[] = []
      for (const storageProofsData of ropsten_contractWithStorage.storageProof) {
        await storageTrie.updateFromProof(storageProofsData.proof.map((p) => hexStringToBytes(p)))

        storageKeys.push(hexStringToBytes(storageProofsData.key))
      }
      t.deepEqual(storageTrie.root(), hexStringToBytes(storageRoot), 'storage trie root matches')
      const addressHex = bytesToHex(address.bytes)
      stateManager._storageTries[addressHex] = storageTrie

      const proof = await stateManager.getProof(address, storageKeys)
      const trieProof = await trie._createProof(hexStringToBytes(proof.address))
      st.deepEqual(
        trieProof,
        proof.accountProof.map((p) => hexStringToBytes(p)),
        'state account proof = Trie proof'
      )
      st.equal(proof.address, ropsten_contractWithStorage.address, 'address should match')
      st.equal(
        proof.accountProof.length,
        ropsten_contractWithStorage.accountProof.length,
        'account proof length should match'
      )
      st.equal(
        proof.storageProof.length,
        ropsten_contractWithStorage.storageProof.length,
        'storage proof length should match'
      )
      st.equal(proof.balance, ropsten_contractWithStorage.balance, 'balance should match')
      st.equal(proof.codeHash, ropsten_contractWithStorage.codeHash, 'codeHash should match')
      st.equal(
        proof.storageHash,
        ropsten_contractWithStorage.storageHash,
        'storage hash should match'
      )
      st.equal(proof.nonce, ropsten_contractWithStorage.nonce, 'nonce should match')
      st.deepEqual(
        proof.accountProof,
        ropsten_contractWithStorage.accountProof,
        'account proof should match completely'
      )
      st.deepEqual(
        proof.storageProof.map((p) => p.value),
        ropsten_contractWithStorage.storageProof.map((p) => p.value),
        `storage proof values should match`
      )
      st.deepEqual(
        proof.storageProof.map((p) => p.proof.length),
        ropsten_contractWithStorage.storageProof.map((p) => p.proof.length),
        'storage proof proofs should match'
      )
      const valid = await stateManager.verifyProof(ropsten_contractWithStorage)
      st.ok(valid, 'state manager verified proof')
      st.end()
    }
  )

  t.test('should throw on invalid proofs - existing accounts/slots', async (st) => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = Address.fromString('0x2D80502854FC7304c3E3457084DE549f5016B73f')
    const trie = new Trie({ useKeyHashing: true })
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropsten_contractWithStorage.accountProof) {
      const bufferData = hexStringToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.database().put(key, bufferData)
    }
    const storageRoot = ropsten_contractWithStorage.storageHash
    const storageTrie = new Trie({ useKeyHashing: true })
    const storageKeys: Uint8Array[] = []
    for (const storageProofsData of ropsten_contractWithStorage.storageProof) {
      storageKeys.push(hexStringToBytes(storageProofsData.key))
      for (const storageProofData of storageProofsData.proof) {
        const key = keccak256(hexStringToBytes(storageProofData))
        await storageTrie.database().put(key, hexStringToBytes(storageProofData))
      }
    }
    await storageTrie.setRootByHash(hexStringToBytes(storageRoot))
    const addressHex = bytesToHex(address.bytes)
    stateManager._storageTries[addressHex] = storageTrie

    // tamper with account data
    const testdata = ropsten_contractWithStorage as any
    for (const tamper of ['nonce', 'balance', 'codeHash', 'storageHash']) {
      const original = testdata[tamper]
      try {
        const newField = `0x9${original.slice(3)}`
        testdata[tamper] = newField
        await stateManager.verifyProof(testdata)
        // note: this implicitly means that newField !== original,
        // if newField === original then the proof would be valid and test would fail
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
    const trie = new Trie({ useKeyHashing: true })
    const stateManager = new DefaultStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropsten_nonexistentAccount.accountProof) {
      const bufferData = hexStringToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie.database().put(key, bufferData)
    }
    const storageRoot = ropsten_nonexistentAccount.storageHash
    const storageTrie = new Trie({ useKeyHashing: true })
    await storageTrie.setRootByHash(hexStringToBytes(storageRoot))
    const addressHex = bytesToHex(address.bytes)
    stateManager._storageTries[addressHex] = storageTrie
    await trie.setRootByHash(stateRoot!)

    // tamper with account data
    const testdata = ropsten_nonexistentAccount as any
    for (const tamper of ['nonce', 'balance', 'codeHash', 'storageHash']) {
      const original = testdata[tamper]
      try {
        const newField = `0x9${original.slice(3)}`
        testdata[tamper] = newField
        await stateManager.verifyProof(testdata)
        // note: this implicitly means that newField !== original,
        // if newField === original then the proof would be valid and test would fail
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
