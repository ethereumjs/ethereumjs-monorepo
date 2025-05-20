import {
  KECCAK256_RLP,
  bytesToHex,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Caches, MerkleStateManager } from '../src/index.ts'

import { createAccountWithDefaults } from './util.ts'

describe('StateManager -> General/Account', () => {
  for (const accountCacheOpts of [{ size: 1000 }, { size: 0 }]) {
    it(`should set the state root to empty`, async () => {
      const stateManager = new MerkleStateManager({
        caches: new Caches({ account: accountCacheOpts }),
      })
      assert.isTrue(equalsBytes(stateManager['_trie'].root(), KECCAK256_RLP), 'it has default root')

      // commit some data to the trie
      const address = createAddressFromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
      const account = createAccountWithDefaults(BigInt(0), BigInt(1000))
      await stateManager.checkpoint()
      await stateManager.putAccount(address, account)
      await stateManager.commit()
      await stateManager.flush()
      assert.isFalse(equalsBytes(stateManager['_trie'].root(), KECCAK256_RLP), 'it has a new root')

      // set state root to empty trie root
      await stateManager.setStateRoot(KECCAK256_RLP)

      const res = await stateManager.getStateRoot()
      assert.isTrue(equalsBytes(res, KECCAK256_RLP), 'it has default root')
    })

    it(`should clear the cache when the state root is set`, async () => {
      const stateManager = new MerkleStateManager({
        caches: new Caches({ account: accountCacheOpts }),
      })
      const address = createAddressFromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
      const account = createAccountWithDefaults()

      // test account storage cache
      const initialStateRoot = await stateManager.getStateRoot()
      await stateManager.checkpoint()
      await stateManager.putAccount(address, account)

      const account0 = await stateManager.getAccount(address)
      assert.strictEqual(account0!.balance, account.balance, 'account value is set in the cache')

      await stateManager.commit()
      const account1 = await stateManager.getAccount(address)
      assert.strictEqual(
        account1!.balance,
        account.balance,
        'account value is set in the state trie',
      )

      await stateManager.setStateRoot(initialStateRoot)
      const account2 = await stateManager.getAccount(address)
      assert.strictEqual(
        account2,
        undefined,
        'account is not present any more in original state root',
      )

      // test contract storage cache
      await stateManager.checkpoint()
      const key = hexToBytes('0x1234567890123456789012345678901234567890123456789012345678901234')
      const value = hexToBytes('0x1234')
      await stateManager.putAccount(address, account)
      await stateManager.putStorage(address, key, value)

      const contract0 = await stateManager.getStorage(address, key)
      assert.isTrue(
        equalsBytes(contract0, value),
        "contract key's value is set in the _storageTries cache",
      )

      await stateManager.commit()
      await stateManager.setStateRoot(initialStateRoot)
      try {
        await stateManager.getStorage(address, key)
      } catch {
        assert.isTrue(true, 'should throw if getStorage() is called on non existing address')
      }
    })

    it('should put and get account, and add to the underlying cache if the account is not found', async () => {
      const stateManager = new MerkleStateManager({
        caches: new Caches({ account: accountCacheOpts }),
      })
      const account = createAccountWithDefaults()
      const address = createAddressFromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')

      await stateManager.putAccount(address, account)

      const res1 = await stateManager.getAccount(address)

      assert.strictEqual(res1!.balance, BigInt(0xfff384))

      await stateManager.flush()
      stateManager['_caches']?.account?.clear()

      const res2 = await stateManager.getAccount(address)

      assert.isTrue(equalsBytes(res1!.serialize(), res2!.serialize()))
    })

    it(`should return undefined for a non-existent account`, async () => {
      const stateManager = new MerkleStateManager({
        caches: new Caches({ account: accountCacheOpts }),
      })

      assert.isUndefined(
        await stateManager.getAccount(
          createAddressFromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'),
        ),
      )
    })

    it(`should return undefined for an existent account`, async () => {
      const stateManager = new MerkleStateManager({
        caches: new Caches({ account: accountCacheOpts }),
      })
      const account = createAccountWithDefaults(BigInt(0x1), BigInt(0x1))
      const address = createAddressFromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')

      await stateManager.putAccount(address, account)

      assert.isDefined(await stateManager.getAccount(address))
    })

    it(`should modify account fields correctly`, async () => {
      const stateManager = new MerkleStateManager({
        caches: new Caches({ account: accountCacheOpts }),
      })
      const account = createAccountWithDefaults()
      const address = createAddressFromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
      await stateManager.putAccount(address, account)

      await stateManager.modifyAccountFields(address, { balance: BigInt(1234) })

      const res1 = await stateManager.getAccount(address)

      assert.strictEqual(res1!.balance, BigInt(0x4d2))

      await stateManager.modifyAccountFields(address, { nonce: BigInt(1) })

      const res2 = await stateManager.getAccount(address)

      assert.strictEqual(res2!.nonce, BigInt(1))

      await stateManager.modifyAccountFields(address, {
        codeHash: hexToBytes('0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b'),
        storageRoot: hexToBytes(
          '0xcafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7',
        ),
      })

      const res3 = await stateManager.getAccount(address)

      assert.strictEqual(
        bytesToHex(res3!.codeHash),
        '0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
      )
      assert.strictEqual(
        bytesToHex(res3!.storageRoot),
        '0xcafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7',
      )
    })
  }
})
