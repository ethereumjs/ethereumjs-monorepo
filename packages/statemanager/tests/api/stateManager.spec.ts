import tape from 'tape'
import {
  Account,
  Address,
  toBuffer,
  keccak256,
  KECCAK256_RLP,
  KECCAK256_RLP_S,
  unpadBuffer,
  zeros,
} from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '../../src'
import { createAccount } from '../util'

tape('StateManager', (t) => {
  t.test('should instantiate', async (st) => {
    const stateManager = new DefaultStateManager()

    st.deepEqual(stateManager._trie.root, KECCAK256_RLP, 'it has default root')
    st.equal(stateManager._common.hardfork(), 'petersburg', 'it has default hardfork')
    const res = await stateManager.getStateRoot()
    st.deepEqual(res, KECCAK256_RLP, 'it has default root')
    st.end()
  })

  t.test('should set the state root to empty', async (st) => {
    const stateManager = new DefaultStateManager()
    st.ok(stateManager._trie.root.equals(KECCAK256_RLP), 'it has default root')

    // commit some data to the trie
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const account = createAccount(BigInt(0), BigInt(1000))
    await stateManager.checkpoint()
    await stateManager.putAccount(address, account)
    await stateManager.commit()
    await stateManager.flush()
    st.ok(!stateManager._trie.root.equals(KECCAK256_RLP), 'it has a new root')

    // set state root to empty trie root
    const emptyTrieRoot = Buffer.from(KECCAK256_RLP_S, 'hex')
    await stateManager.setStateRoot(emptyTrieRoot)

    const res = await stateManager.getStateRoot()
    st.ok(res.equals(KECCAK256_RLP), 'it has default root')
    st.end()
  })

  t.test('should clear the cache when the state root is set', async (st) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const account = createAccount()

    // test account storage cache
    const initialStateRoot = await stateManager.getStateRoot()
    await stateManager.checkpoint()
    await stateManager.putAccount(address, account)

    const account0 = await stateManager.getAccount(address)
    st.equal(account0.balance, account.balance, 'account value is set in the cache')

    await stateManager.commit()
    const account1 = await stateManager.getAccount(address)
    st.equal(account1.balance, account.balance, 'account value is set in the state trie')

    await stateManager.setStateRoot(initialStateRoot)
    const account2 = await stateManager.getAccount(address)
    st.equal(account2.balance, BigInt(0), 'account value is set to 0 in original state root')

    // test contract storage cache
    await stateManager.checkpoint()
    const key = toBuffer('0x1234567890123456789012345678901234567890123456789012345678901234')
    const value = Buffer.from('0x1234')
    await stateManager.putContractStorage(address, key, value)

    const contract0 = await stateManager.getContractStorage(address, key)
    st.ok(contract0.equals(value), "contract key's value is set in the _storageTries cache")

    await stateManager.commit()
    await stateManager.setStateRoot(initialStateRoot)
    const contract1 = await stateManager.getContractStorage(address, key)
    st.equal(contract1.length, 0, "contract key's value is unset in the _storageTries cache")

    st.end()
  })

  t.test(
    'should put and get account, and add to the underlying cache if the account is not found',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const account = createAccount()
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))

      await stateManager.putAccount(address, account)

      const res1 = await stateManager.getAccount(address)

      st.equal(res1.balance, BigInt(0xfff384))

      await stateManager._cache.flush()
      stateManager._cache.clear()

      const res2 = await stateManager.getAccount(address)

      st.equal(stateManager._cache._cache.keys[0], address.buf.toString('hex'))
      st.ok(res1.serialize().equals(res2.serialize()))

      st.end()
    }
  )

  t.test(
    'should call the callback with a boolean representing emptiness, when the account is empty',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))

      const res = await stateManager.accountIsEmpty(address)

      st.ok(res)

      st.end()
    }
  )

  t.test('should return false for a non-existent account', async (st) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))

    const res = await stateManager.accountExists(address)

    st.notOk(res)

    st.end()
  })

  t.test('should return true for an existent account', async (st) => {
    const stateManager = new DefaultStateManager()
    const account = createAccount(BigInt(0x1), BigInt(0x1))
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))

    await stateManager.putAccount(address, account)

    const res = await stateManager.accountExists(address)

    st.ok(res)

    st.end()
  })

  t.test(
    'should call the callback with a false boolean representing non-emptiness when the account is not empty',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const account = createAccount(BigInt(0x1), BigInt(0x1))
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))

      await stateManager.putAccount(address, account)

      const res = await stateManager.accountIsEmpty(address)

      st.notOk(res)

      st.end()
    }
  )

  t.test('should modify account fields correctly', async (st) => {
    const stateManager = new DefaultStateManager()
    const account = createAccount()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    await stateManager.putAccount(address, account)

    await stateManager.modifyAccountFields(address, { balance: BigInt(1234) })

    const res1 = await stateManager.getAccount(address)

    st.equal(res1.balance, BigInt(0x4d2))

    await stateManager.modifyAccountFields(address, { nonce: BigInt(1) })

    const res2 = await stateManager.getAccount(address)

    st.equal(res2.nonce, BigInt(1))

    await stateManager.modifyAccountFields(address, {
      codeHash: Buffer.from(
        'd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
        'hex'
      ),
      stateRoot: Buffer.from(
        'cafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7',
        'hex'
      ),
    })

    const res3 = await stateManager.getAccount(address)

    st.equal(
      res3.codeHash.toString('hex'),
      'd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b'
    )
    st.equal(
      res3.stateRoot.toString('hex'),
      'cafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7'
    )

    st.end()
  })

  t.test(
    'should modify account fields correctly on previously non-existent account',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))

      await stateManager.modifyAccountFields(address, { balance: BigInt(1234) })
      const res1 = await stateManager.getAccount(address)
      st.equal(res1.balance, BigInt(0x4d2))

      await stateManager.modifyAccountFields(address, { nonce: BigInt(1) })
      const res2 = await stateManager.getAccount(address)
      st.equal(res2.nonce, BigInt(1))

      const newCodeHash = Buffer.from(
        'd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
        'hex'
      )
      const newStateRoot = Buffer.from(
        'cafd881ab193703b83816c49ff6c2bf6ba6f464a1be560c42106128c8dbc35e7',
        'hex'
      )
      await stateManager.modifyAccountFields(address, {
        codeHash: newCodeHash,
        stateRoot: newStateRoot,
      })

      const res3 = await stateManager.getAccount(address)
      st.ok(res3.codeHash.equals(newCodeHash))
      st.ok(res3.stateRoot.equals(newStateRoot))
      st.end()
    }
  )

  t.test('should dump storage', async (st) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const account = createAccount()

    await stateManager.putAccount(address, account)

    const key = toBuffer('0x1234567890123456789012345678901234567890123456789012345678901234')
    const value = toBuffer('0x0a') // We used this value as its RLP encoding is also 0a
    await stateManager.putContractStorage(address, key, value)

    const data = await stateManager.dumpStorage(address)
    const expect = { [keccak256(key).toString('hex')]: '0a' }
    st.deepEqual(data, expect, 'should dump storage value')

    st.end()
  })

  t.test('should pass Common object when copying the state manager', (st) => {
    const stateManager = new DefaultStateManager({
      common: new Common({ chain: Chain.Goerli, hardfork: Hardfork.Byzantium }),
    })

    st.equal(stateManager._common.chainName(), 'goerli')
    st.equal(stateManager._common.hardfork(), 'byzantium')

    const stateManagerCopy = stateManager.copy()
    st.equal((<any>stateManagerCopy)._common.chainName(), 'goerli')
    st.equal((<any>stateManagerCopy)._common.hardfork(), 'byzantium')

    st.end()
  })

  t.test("should validate the key's length when modifying a contract's storage", async (st) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    try {
      await stateManager.putContractStorage(address, Buffer.alloc(12), toBuffer('0x1231'))
    } catch (e: any) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })

  t.test("should validate the key's length when reading a contract's storage", async (st) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    try {
      await stateManager.getContractStorage(address, Buffer.alloc(12))
    } catch (e: any) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })

  t.test('should store codehashes using a prefix', async (st) => {
    /*
      This test is mostly an example of why a code prefix is necessary
      I an address, we put two storage values. The preimage of the (storage trie) root hash is known
      This preimage is used as codeHash

      NOTE: Currently, the only problem which this code prefix fixes, is putting 0x80 as contract code
      -> This hashes to the empty trie node hash (0x80 = RLP([])), so keccak256(0x80) = empty trie node hash
      -> Therefore, each empty state trie now points to 0x80, which is not a valid trie node, which crashes @ethereumjs/trie
    */

    // Setup
    const stateManager = new DefaultStateManager()
    const codeStateManager = new DefaultStateManager()
    const address1 = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const key1 = Buffer.from('00'.repeat(32), 'hex')
    const key2 = Buffer.from('00'.repeat(31) + '01', 'hex')

    await stateManager.putContractStorage(address1, key1, key2)
    await stateManager.putContractStorage(address1, key2, key2)
    const root = await stateManager.getStateRoot()
    const rawNode = await stateManager._trie.db.get(root)

    await codeStateManager.putContractCode(address1, rawNode!)

    let codeSlot1 = await codeStateManager.getContractStorage(address1, key1)
    let codeSlot2 = await codeStateManager.getContractStorage(address1, key2)

    st.ok(codeSlot1.length == 0, 'slot 0 is empty')
    st.ok(codeSlot2.length == 0, 'slot 1 is empty')

    const code = await codeStateManager.getContractCode(address1)
    st.ok(code.length > 0, 'code deposited correctly')

    const slot1 = await stateManager.getContractStorage(address1, key1)
    const slot2 = await stateManager.getContractStorage(address1, key2)

    st.ok(slot1.length > 0, 'storage key0 deposited correctly')
    st.ok(slot2.length > 0, 'storage key1 deposited correctly')

    let slotCode = await stateManager.getContractCode(address1)
    st.ok(slotCode.length == 0, 'code cannot be loaded')

    // Checks by either setting state root to codeHash, or codeHash to stateRoot
    // The knowledge of the tries should not change
    let account = await stateManager.getAccount(address1)
    account.codeHash = root

    await stateManager.putAccount(address1, account)

    slotCode = await stateManager.getContractCode(address1)
    st.ok(slotCode.length == 0, 'code cannot be loaded') // This test fails if no code prefix is used

    account = await codeStateManager.getAccount(address1)
    account.stateRoot = root

    await codeStateManager.putAccount(address1, account)

    codeSlot1 = await codeStateManager.getContractStorage(address1, key1)
    codeSlot2 = await codeStateManager.getContractStorage(address1, key2)

    st.ok(codeSlot1.length == 0, 'slot 0 is empty')
    st.ok(codeSlot2.length == 0, 'slot 1 is empty')

    st.end()
  })
})

tape('StateManager - Contract code', (tester) => {
  const it = tester.test
  it('should set and get code', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const code = Buffer.from(
      '73095e7baea6a6c7c4c2dfeb977efac326af552d873173095e7baea6a6c7c4c2dfeb977efac326af552d873157',
      'hex'
    )
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xb30fb32201fe0486606ad451e1a61e2ae1748343cd3d411ed992ffcc0774edd4',
    }
    const account = Account.fromAccountData(raw)
    await stateManager.putAccount(address, account)
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    t.ok(code.equals(codeRetrieved))
    t.end()
  })

  it('should not get code if is not contract', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
    }
    const account = Account.fromAccountData(raw)
    await stateManager.putAccount(address, account)
    const code = await stateManager.getContractCode(address)
    t.ok(code.equals(Buffer.alloc(0)))
    t.end()
  })

  it('should set empty code', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
    }
    const account = Account.fromAccountData(raw)
    const code = Buffer.alloc(0)
    await stateManager.putAccount(address, account)
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    t.ok(codeRetrieved.equals(Buffer.alloc(0)))
    t.end()
  })
})

tape('StateManager - Contract storage', (tester) => {
  const it = tester.test

  it('should throw on storage values larger than 32 bytes', async (t) => {
    t.plan(1)
    const stateManager = new DefaultStateManager()
    const address = Address.zero()
    const key = zeros(32)
    const value = Buffer.from('aa'.repeat(33), 'hex')
    try {
      await stateManager.putContractStorage(address, key, value)
      t.fail('did not throw')
    } catch (e: any) {
      t.pass('threw on trying to set storage values larger than 32 bytes')
    }
    t.end()
  })

  it('should strip zeros of storage values', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = Address.zero()

    const key0 = zeros(32)
    const value0 = Buffer.from('00' + 'aa'.repeat(30), 'hex') // put a value of 31-bytes length with a leading zero byte
    const expect0 = unpadBuffer(value0)
    await stateManager.putContractStorage(address, key0, value0)
    const slot0 = await stateManager.getContractStorage(address, key0)
    t.ok(slot0.equals(expect0), 'value of 31 bytes padded correctly')

    const key1 = Buffer.concat([zeros(31), Buffer.from('01', 'hex')])
    const value1 = Buffer.from('0000' + 'aa'.repeat(1), 'hex') // put a value of 1-byte length with two leading zero bytes
    const expect1 = unpadBuffer(value1)
    await stateManager.putContractStorage(address, key1, value1)
    const slot1 = await stateManager.getContractStorage(address, key1)

    t.ok(slot1.equals(expect1), 'value of 1 byte padded correctly')
    t.end()
  })

  it('should delete storage values which only consist of zero bytes', async (t) => {
    const address = Address.zero()
    const key = zeros(32)
    const startValue = Buffer.from('01', 'hex')

    const zeroLengths = [0, 1, 31, 32] // checks for arbitrary-length zeros
    t.plan(zeroLengths.length)

    for (const length of zeroLengths) {
      const stateManager = new DefaultStateManager()
      const value = zeros(length)
      await stateManager.putContractStorage(address, key, startValue)
      const currentValue = await stateManager.getContractStorage(address, key)
      if (!currentValue.equals(startValue)) {
        // sanity check
        t.fail('contract value not set correctly')
      } else {
        // delete the value
        await stateManager.putContractStorage(address, key, value)
        const deleted = await stateManager.getContractStorage(address, key)
        t.ok(deleted.equals(zeros(0)), 'the storage key should be deleted')
      }
    }
    t.end()
  })

  it('should not strip trailing zeros', async (t) => {
    const address = Address.zero()
    const key = zeros(32)
    const value = Buffer.from('0000aabb00', 'hex')
    const expect = Buffer.from('aabb00', 'hex')
    const stateManager = new DefaultStateManager()
    await stateManager.putContractStorage(address, key, value)
    const contractValue = await stateManager.getContractStorage(address, key)
    t.ok(contractValue.equals(expect), 'trailing zeros are not stripped')
    t.end()
  })
})
