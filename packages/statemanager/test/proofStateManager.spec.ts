import { MerklePatriciaTrie, createMPT } from '@ethereumjs/mpt'
import {
  Account,
  Address,
  bytesToHex,
  bytesToUnprefixedHex,
  createAddressFromPrivateKey,
  createAddressFromString,
  createZeroAddress,
  equalsBytes,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { assert, describe, it } from 'vitest'

import { MerkleStateManager } from '../src/index.js'
import { getMerkleStateProof, verifyMerkleStateProof } from '../src/proofs/index.js'

import { ropstenContractWithStorageData } from './testdata/ropsten_contractWithStorage.js'
import { ropstenNonexistentAccountData } from './testdata/ropsten_nonexistentAccount.js'
import { ropstenValidAccountData } from './testdata/ropsten_validAccount.js'

import type { PrefixedHexString } from '@ethereumjs/util'

describe('ProofStateManager', () => {
  it(`should return quantity-encoded RPC representation`, async () => {
    const address = createZeroAddress()
    const key = new Uint8Array(32)
    const stateManager = new MerkleStateManager()

    const proof = await getMerkleStateProof(stateManager, address, [key])
    assert.equal(proof.balance, '0x0', 'Balance is in quantity-encoded RPC representation')
    assert.equal(proof.nonce, '0x0', 'Nonce is in quantity-encoded RPC representation')
  })

  it(`should correctly return the right storage root / account root`, async () => {
    const address = createZeroAddress()
    const key = new Uint8Array(32)
    const stateManager = new MerkleStateManager()

    await stateManager.putAccount(address, new Account(BigInt(100), BigInt(200)))
    const storageRoot = (await stateManager.getAccount(address))!.storageRoot

    await stateManager.putStorage(address, key, new Uint8Array([10]))

    const proof = await getMerkleStateProof(stateManager, address, [key])
    assert.ok(!equalsBytes(hexToBytes(proof.storageHash), storageRoot))
  })

  it(`should return quantity-encoded RPC representation for existing accounts`, async () => {
    const address = createZeroAddress()
    const key = new Uint8Array(32)
    const stateManager = new MerkleStateManager()

    const account = new Account()
    await stateManager.putAccount(address, account)

    const proof = await getMerkleStateProof(stateManager, address, [key])
    assert.equal(proof.balance, '0x0', 'Balance is in quantity-encoded RPC representation')
    assert.equal(proof.nonce, '0x0', 'Nonce is in quantity-encoded RPC representation')

    account.balance = BigInt(1)
    await stateManager.putAccount(address, account)

    const proof2 = await getMerkleStateProof(stateManager, address, [key])
    assert.equal(proof2.balance, '0x1', 'Balance correctly encoded')
    assert.equal(proof2.nonce, '0x0', 'Nonce is in quantity-encoded RPC representation')

    account.balance = BigInt(0)
    account.nonce = BigInt(1)
    await stateManager.putAccount(address, account)

    const proof3 = await getMerkleStateProof(stateManager, address, [key])
    assert.equal(proof3.balance, '0x0', 'Balance is in quantity-encoded RPC representation')
    assert.equal(proof3.nonce, '0x1', 'Nonce is correctly encoded')
  })

  it(`should get and verify EIP 1178 proofs`, async () => {
    const address = createZeroAddress()
    const key = new Uint8Array(32)
    const value = hexToBytes('0x0000aabb00')
    const code = hexToBytes('0x6000')
    const stateManager = new MerkleStateManager()
    await stateManager.checkpoint()
    await stateManager.putAccount(address, new Account())
    await stateManager.putStorage(address, key, value)
    await stateManager.putCode(address, code)
    const account = await stateManager.getAccount(address)
    account!.balance = BigInt(1)
    account!.nonce = BigInt(2)
    await stateManager.putAccount(address, account!)
    const address2 = new Address(hexToBytes(`0x${'20'.repeat(20)}`))
    const account2 = await stateManager.getAccount(address2)
    account!.nonce = BigInt(2)
    await stateManager.putAccount(address2, account2!)
    await stateManager.commit()
    await stateManager.flush()

    const proof = await getMerkleStateProof(stateManager, address, [key])
    assert.ok(await verifyMerkleStateProof(stateManager, proof))
    const nonExistenceProof = await getMerkleStateProof(
      stateManager,
      createAddressFromPrivateKey(randomBytes(32)),
    )
    assert.equal(
      await verifyMerkleStateProof(stateManager, nonExistenceProof),
      true,
      'verified proof of non-existence of account',
    )
  })

  it(`should report data equal to geth output for EIP 1178 proofs`, async () => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // Block: 11098094 (hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146)
    // Account: 0xc626553e7c821d0f8308c28d56c60e3c15f8d55a
    // Storage slots: empty list
    const address = createAddressFromString('0xc626553e7c821d0f8308c28d56c60e3c15f8d55a')
    const trie = await createMPT({ useKeyHashing: true })
    const stateManager = new MerkleStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropstenValidAccountData.accountProof) {
      const bufferData = hexToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie['_db'].put(key, bufferData)
    }
    trie.root(stateRoot!)
    const proof = await getMerkleStateProof(stateManager, address)
    assert.deepEqual(ropstenValidAccountData, proof)
    assert.ok(await verifyMerkleStateProof(stateManager, ropstenValidAccountData))
  })

  it('should report data equal to geth output for EIP 1178 proofs - nonexistent account', async () => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // Block: 11098094 (hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146)
    // Account: 0x68268f12253f69f66b188c95b8106b2f847859fc (this account does not exist)
    // Storage slots: empty list
    const address = createAddressFromString('0x68268f12253f69f66b188c95b8106b2f847859fc')
    const trie = new MerklePatriciaTrie({ useKeyHashing: true })
    const stateManager = new MerkleStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropstenNonexistentAccountData.accountProof) {
      const bufferData = hexToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie['_db'].put(key, bufferData)
    }
    trie.root(stateRoot!)
    const proof = await getMerkleStateProof(stateManager, address)
    assert.deepEqual(ropstenNonexistentAccountData, proof)
    assert.ok(await verifyMerkleStateProof(stateManager, ropstenNonexistentAccountData))
  })

  it('should report data equal to geth output for EIP 1178 proofs - account with storage', async () => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = createAddressFromString('0x2D80502854FC7304c3E3457084DE549f5016B73f')
    const trie = new MerklePatriciaTrie({ useKeyHashing: true })
    const stateManager = new MerkleStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropstenContractWithStorageData.accountProof) {
      const bufferData = hexToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie['_db'].put(key, bufferData)
    }
    const storageRoot = ropstenContractWithStorageData.storageHash
    const storageTrie = new MerklePatriciaTrie({ useKeyHashing: true })
    const storageKeys: Uint8Array[] = []
    for (const storageProofsData of ropstenContractWithStorageData.storageProof) {
      storageKeys.push(hexToBytes(storageProofsData.key))
      for (const storageProofData of storageProofsData.proof) {
        const key = keccak256(hexToBytes(storageProofData))
        await storageTrie['_db'].put(key, hexToBytes(storageProofData))
      }
    }
    storageTrie.root(hexToBytes(storageRoot))
    const addressHex = bytesToUnprefixedHex(keccak256(address.bytes))
    stateManager['_storageTries'][addressHex] = storageTrie
    trie.root(stateRoot!)

    const proof = await getMerkleStateProof(stateManager, address, storageKeys)
    assert.deepEqual(ropstenContractWithStorageData, proof)
    await verifyMerkleStateProof(stateManager, ropstenContractWithStorageData)
  })

  it(`should throw on invalid proofs - existing accounts/slots`, async () => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = createAddressFromString('0x2D80502854FC7304c3E3457084DE549f5016B73f')
    const trie = new MerklePatriciaTrie({ useKeyHashing: true })
    const stateManager = new MerkleStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropstenContractWithStorageData.accountProof) {
      const bufferData = hexToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie['_db'].put(key, bufferData)
    }
    const storageRoot = ropstenContractWithStorageData.storageHash
    const storageTrie = new MerklePatriciaTrie({ useKeyHashing: true })
    const storageKeys: Uint8Array[] = []
    for (const storageProofsData of ropstenContractWithStorageData.storageProof) {
      storageKeys.push(hexToBytes(storageProofsData.key))
      for (const storageProofData of storageProofsData.proof) {
        const key = keccak256(hexToBytes(storageProofData))
        await storageTrie['_db'].put(key, hexToBytes(storageProofData))
      }
    }
    storageTrie.root(hexToBytes(storageRoot))
    const addressHex = bytesToHex(address.bytes)
    stateManager['_storageTries'][addressHex] = storageTrie
    trie.root(stateRoot!)

    // tamper with account data
    const testData = { ...ropstenContractWithStorageData }
    for (const tamper of ['nonce', 'balance', 'codeHash', 'storageHash']) {
      const original = testData[tamper as keyof typeof testData] as PrefixedHexString
      try {
        ;(testData[tamper as keyof typeof testData] as PrefixedHexString) =
          `0x9${original.slice(3)}`
        await verifyMerkleStateProof(stateManager, testData)
        // note: this implicitly means that newField !== original,
        // if newField === original then the proof would be valid and test would fail
        assert.fail('should throw')
      } catch (e) {
        assert.ok(true, 'threw on invalid proof')
      } finally {
        ;(testData[tamper as keyof typeof testData] as PrefixedHexString) = original
      }
    }

    // tamper with storage slots
    for (const slot of testData.storageProof) {
      const original = slot.value
      slot.value = `0x9${original.slice(3)}`
      try {
        await verifyMerkleStateProof(stateManager, testData)
        assert.fail('should throw')
      } catch {
        assert.ok(true, 'threw on invalid proof')
      } finally {
        slot.value = original
      }
    }
  })

  it(`should throw on invalid proofs - nonexistent account`, async () => {
    // Data source: Ropsten, retrieved with Geth eth_getProof
    // eth.getProof("0x2D80502854FC7304c3E3457084DE549f5016B73f", ["0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1ca", "0x1e8bf26b05059b66f11b6e0c5b9fe941f81181d6cc9f2af65ccee86e95cea1cb"], 11098094)
    // Note: the first slot has a value, but the second slot is empty
    // Note: block hash 0x1d9ea6981b8093a2b63f22f74426ceb6ba1acae3fddd7831442bbeba3fa4f146
    const address = createAddressFromString('0x68268f12253f69f66b188c95b8106b2f847859fc')
    const trie = new MerklePatriciaTrie({ useKeyHashing: true })
    const stateManager = new MerkleStateManager({ trie })
    // Dump all the account proof data in the DB
    let stateRoot: Uint8Array | undefined
    for (const proofData of ropstenNonexistentAccountData.accountProof) {
      const bufferData = hexToBytes(proofData)
      const key = keccak256(bufferData)
      if (stateRoot === undefined) {
        stateRoot = key
      }
      await trie['_db'].put(key, bufferData)
    }
    const storageRoot = ropstenNonexistentAccountData.storageHash
    const storageTrie = new MerklePatriciaTrie({ useKeyHashing: true })
    storageTrie.root(hexToBytes(storageRoot))
    const addressHex = bytesToHex(address.bytes)
    stateManager['_storageTries'][addressHex] = storageTrie
    trie.root(stateRoot!)

    // tamper with account data
    const testdata = { ...(ropstenNonexistentAccountData as any) }
    for (const tamper of ['nonce', 'balance', 'codeHash', 'storageHash']) {
      const original = testdata[tamper]
      try {
        const newField = `0x9${original.slice(3)}`
        testdata[tamper] = newField
        await verifyMerkleStateProof(stateManager, testdata)
        // note: this implicitly means that newField !== original,
        // if newField === original then the proof would be valid and test would fail
        assert.fail('should throw')
      } catch (e) {
        assert.ok(true, 'threw on invalid proof')
      } finally {
        // restore original valid proof
        testdata[tamper] = original
      }
    }
  })
})
