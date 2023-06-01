import { Address, KECCAK256_RLP, bytesToHex, equalsBytes, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'
// explicitly import `inherits` to fix karma-typescript issue
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inherits } from 'util'

import { DefaultStateManager } from '../src'

import { createAccount } from './util'

tape('StateManager -> General/Account', (t) => {
  for (const accountCacheOpts of [{ deactivate: false }, { deactivate: true }]) {
    t.test('should set the state root to empty', async (st) => {
      const stateManager = new DefaultStateManager({ accountCacheOpts })
      st.ok(equalsBytes(stateManager._trie.root(), KECCAK256_RLP), 'it has default root')

      // commit some data to the trie
      const address = new Address(hexStringToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
      const account = createAccount(BigInt(0), BigInt(1000))
      await stateManager.checkpoint()
      await stateManager.putAccount(address, account)
      await stateManager.commit()
      await stateManager.flush()
      st.ok(!equalsBytes(stateManager._trie.root(), KECCAK256_RLP), 'it has a new root')

      // set state root to empty trie root
      await stateManager.setStateRoot(KECCAK256_RLP)

      const res = await stateManager.getStateRoot()
      st.ok(equalsBytes(res, KECCAK256_RLP), 'it has default root')
      st.end()
    })

    t.test('should clear the cache when the state root is set', async (st) => {
      const stateManager = new DefaultStateManager({ accountCacheOpts })
      const address = new Address(hexStringToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
      const account = createAccount()

      // test account storage cache
      const initialStateRoot = await stateManager.getStateRoot()
      await stateManager.checkpoint()
      await stateManager.putAccount(address, account)

      const account0 = await stateManager.getAccount(address)
      st.equal(account0!.balance, account.balance, 'account value is set in the cache')

      await stateManager.commit()
      const account1 = await stateManager.getAccount(address)
      st.equal(account1!.balance, account.balance, 'account value is set in the state trie')

      await stateManager.setStateRoot(initialStateRoot)
      const account2 = await stateManager.getAccount(address)
      st.equal(account2, undefined, 'account is not present any more in original state root')

      // test contract storage cache
      await stateManager.checkpoint()
      const key = hexStringToBytes(
        '1234567890123456789012345678901234567890123456789012345678901234'
      )
      const value = hexStringToBytes('1234')
      await stateManager.putAccount(address, account)
      await stateManager.putContractStorage(address, key, value)

      const contract0 = await stateManager.getContractStorage(address, key)
      st.ok(equalsBytes(contract0, value), "contract key's value is set in the _storageTries cache")

      await stateManager.commit()
      await stateManager.setStateRoot(initialStateRoot)
      try {
        await stateManager.getContractStorage(address, key)
      } catch (e) {
        st.pass('should throw if getContractStorage() is called on non existing address')
      }

      st.end()
    })

    t.test(
      'should put and get account, and add to the underlying cache if the account is not found',
      async (st) => {
        const stateManager = new DefaultStateManager({ accountCacheOpts })
        const account = createAccount()
        const address = new Address(hexStringToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

        await stateManager.putAccount(address, account)

        const res1 = await stateManager.getAccount(address)

        st.equal(res1!.balance, BigInt(0xfff384))

        await stateManager.flush()
        stateManager._accountCache?.clear()

        const res2 = await stateManager.getAccount(address)

        st.ok(equalsBytes(res1!.serialize(), res2!.serialize()))

        st.end()
      }
    )

    t.test('should return undefined for a non-existent account', async (st) => {
      const stateManager = new DefaultStateManager({ accountCacheOpts })
      const address = new Address(hexStringToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

      const res = (await stateManager.getAccount(address)) === undefined

      st.ok(res)

      st.end()
    })

    t.test('should return undefined for an existent account', async (st) => {
      const stateManager = new DefaultStateManager({ accountCacheOpts })
      const account = createAccount(BigInt(0x1), BigInt(0x1))
      const address = new Address(hexStringToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

      await stateManager.putAccount(address, account)

      const res = (await stateManager.getAccount(address)) === undefined

      st.notOk(res)

      st.end()
    })

    t.test('should modify account fields correctly', async (st) => {
      const stateManager = new DefaultStateManager({ accountCacheOpts })
      const account = createAccount()
      const address = new Address(hexStringToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
      await stateManager.putAccount(address, account)

      await stateManager.modifyAccountFields(address, { balance: BigInt(1234) })

      const res1 = await stateManager.getAccount(address)

      st.equal(res1!.balance, BigInt(0x4d2))

      await stateManager.modifyAccountFields(address, { nonce: BigInt(1) })

      const res2 = await stateManager.getAccount(address)

      st.equal(res2!.nonce, BigInt(1))

      await stateManager.modifyAccountFields(address, {
        codeHash: hexStringToBytes(
          'd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b'
        ),
        storageRoot: hexStringToBytes(
          'cafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7'
        ),
      })

      const res3 = await stateManager.getAccount(address)

      st.equal(
        bytesToHex(res3!.codeHash),
        'd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b'
      )
      st.equal(
        bytesToHex(res3!.storageRoot),
        'cafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7'
      )

      st.end()
    })
  }
})
