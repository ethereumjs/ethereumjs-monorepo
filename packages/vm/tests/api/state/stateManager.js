const tape = require('tape')
const { parallel } = require('async')
const { toBuffer, keccak256, KECCAK256_RLP } = require('ethereumjs-util')
const Common = require('@ethereumjs/common').default
const Account = require('@ethereumjs/account').default
const { DefaultStateManager } = require('../../../dist/state')
const { createAccount } = require('../utils')
const { isRunningInKarma } = require('../../util')

tape('StateManager', (t) => {
  t.test('should instantiate', async (st) => {
    const stateManager = new DefaultStateManager()

    st.deepEqual(stateManager._trie.root, KECCAK256_RLP, 'it has default root')
    st.equal(stateManager._common.hardfork(), 'petersburg', 'it has default hardfork')
    const res = await stateManager.getStateRoot()
    st.deepEqual(res, KECCAK256_RLP, 'it has default root')
    st.end()
  })

  t.test('should clear the cache when the state root is set', async (st) => {
    const stateManager = new DefaultStateManager()
    const addressBuffer = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    const account = createAccount()

    // test account storage cache
    const initialStateRoot = await stateManager.getStateRoot()
    await stateManager.checkpoint()
    await stateManager.putAccount(addressBuffer, account)

    const account0 = await stateManager.getAccount(addressBuffer)
    st.equal(
      account0.balance.toString('hex'),
      account.balance.toString('hex'),
      'account value is set in the cache',
    )

    await stateManager.commit()
    const account1 = await stateManager.getAccount(addressBuffer)
    st.equal(
      account1.balance.toString('hex'),
      account.balance.toString('hex'),
      'account value is set in the state trie',
    )

    await stateManager.setStateRoot(initialStateRoot)
    const account2 = await stateManager.getAccount(addressBuffer)
    st.equal(
      account2.balance.toString('hex'),
      '',
      'account value is set to 0 in original state root',
    )

    // test contract storage cache
    await stateManager.checkpoint()
    const key = toBuffer('0x1234567890123456789012345678901234567890123456789012345678901234')
    const value = Buffer.from('0x1234')
    await stateManager.putContractStorage(addressBuffer, key, value)

    const contract0 = await stateManager.getContractStorage(addressBuffer, key)
    st.equal(
      contract0.toString('hex'),
      value.toString('hex'),
      "contract key's value is set in the _storageTries cache",
    )

    await stateManager.commit()
    await stateManager.setStateRoot(initialStateRoot)
    const contract1 = await stateManager.getContractStorage(addressBuffer, key)
    st.equal(
      contract1.toString('hex'),
      '',
      "contract key's value is unset in the _storageTries cache",
    )

    st.end()
  })

  t.test(
    'should put and get account, and add to the underlying cache if the account is not found',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const account = createAccount()
      const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')

      await stateManager.putAccount(address, account)

      let res = await stateManager.getAccount(address)

      st.equal(res.balance.toString('hex'), 'fff384')

      stateManager._cache.clear()

      res = await stateManager.getAccount(address)

      st.equal(stateManager._cache._cache.keys[0], address.toString('hex'))

      st.end()
    },
  )

  t.test(
    'should call the callback with a boolean representing emptiness, when the account is empty',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')

      let res = await stateManager.accountIsEmpty(address)

      st.ok(res)

      st.end()
    },
  )

  t.test(
    'should return false for a non-existent account',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')

      let res = await stateManager.accountExists(address)

      st.notOk(res)

      st.end()
    },
  )

  t.test(
    'should return true for an existent account',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const account = createAccount('0x1', '0x1')
      const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')

      await stateManager.putAccount(address, account)

      let res = await stateManager.accountExists(address)

      st.ok(res)

      st.end()
    },
  )

  t.test(
    'should call the callback with a false boolean representing non-emptiness when the account is not empty',
    async (st) => {
      const stateManager = new DefaultStateManager()
      const account = createAccount('0x1', '0x1')
      const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')

      await stateManager.putAccount(address, account)

      let res = await stateManager.accountIsEmpty(address)

      st.notOk(res)

      st.end()
    },
  )

  t.test('should generate the genesis state root correctly for mainnet', async (st) => {
    if (isRunningInKarma()) {
      st.skip('skip slow test when running in karma')
      return st.end()
    }

    parallel([
      async () => {
        // 1. Test generating from ethereum/tests
        const genesisData = require('ethereumjs-testing').getSingleFile(
          'BasicTests/genesishashestest.json',
        )
        const stateManager = new DefaultStateManager()

        await stateManager.generateCanonicalGenesis()
        let stateRoot = await stateManager.getStateRoot()
        st.equals(
          stateRoot.toString('hex'),
          genesisData.genesis_state_root,
          'generateCanonicalGenesis should produce correct state root for mainnet from ethereum/tests data',
        )
      },
      async () => {
        // 2. Test generating from common
        const common = new Common('mainnet', 'petersburg')
        const expectedStateRoot = Buffer.from(common.genesis().stateRoot.slice(2), 'hex')
        const stateManager = new DefaultStateManager({ common: common })

        await stateManager.generateCanonicalGenesis()
        let stateRoot = await stateManager.getStateRoot()

        st.true(
          stateRoot.equals(expectedStateRoot),
          `generateCanonicalGenesis should produce correct state root for mainnet from common`,
        )
      },
      () => {
        st.end()
      },
    ])
  })

  t.test('should generate the genesis state root correctly for all other chains', async (st) => {
    const chains = ['ropsten', 'rinkeby', 'kovan', 'goerli']

    for (const chain of chains) {
      const common = new Common(chain, 'petersburg')
      const expectedStateRoot = Buffer.from(common.genesis().stateRoot.slice(2), 'hex')
      const stateManager = new DefaultStateManager({ common: common })

      await stateManager.generateCanonicalGenesis()
      let stateRoot = await stateManager.getStateRoot()

      st.true(
        stateRoot.equals(expectedStateRoot),
        `generateCanonicalGenesis should produce correct state root for ${chain}`,
      )
    }
    st.end()
  })

  t.test('should dump storage', async (st) => {
    const stateManager = new DefaultStateManager()
    const addressBuffer = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    const account = createAccount()

    await stateManager.putAccount('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', account)

    const key = toBuffer('0x1234567890123456789012345678901234567890123456789012345678901234')
    const value = toBuffer('0x0a') // We used this value as its RLP encoding is also 0a
    await stateManager.putContractStorage(addressBuffer, key, value)

    const data = await stateManager.dumpStorage(addressBuffer)
    const expect = { [keccak256(key).toString('hex')]: '0a' }
    st.deepEqual(data, expect, 'should dump storage value')

    st.end()
  })

  t.test('should pass Common object when copying the state manager', (st) => {
    const stateManager = new DefaultStateManager({
      common: new Common('goerli', 'byzantium'),
    })

    st.equal(stateManager._common.chainName(), 'goerli')
    st.equal(stateManager._common.hardfork(), 'byzantium')

    const stateManagerCopy = stateManager.copy()
    st.equal(stateManagerCopy._common.chainName(), 'goerli')
    st.equal(stateManagerCopy._common.hardfork(), 'byzantium')

    st.end()
  })

  t.test("should validate the key's length when modifying a contract's storage", async (st) => {
    const stateManager = new DefaultStateManager()
    const addressBuffer = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    try {
      await stateManager.putContractStorage(addressBuffer, Buffer.alloc(12), toBuffer('0x1231'))
    } catch (e) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })

  t.test("should validate the key's length when reading a contract's storage", async (st) => {
    const stateManager = new DefaultStateManager()
    const addressBuffer = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    try {
      await stateManager.getContractStorage(addressBuffer, Buffer.alloc(12))
    } catch (e) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })
})

tape('Original storage cache', async (t) => {
  const stateManager = new DefaultStateManager()

  const address = 'a94f5374fce5edbc8e2a8697c15331677e6ebf0b'
  const addressBuffer = Buffer.from(address, 'hex')
  const account = createAccount()
  await stateManager.putAccount(address, account)

  const key = Buffer.from('1234567890123456789012345678901234567890123456789012345678901234', 'hex')
  const value = Buffer.from('1234', 'hex')

  t.test('should initially have empty storage value', async (st) => {
    await stateManager.checkpoint()
    const res = await stateManager.getContractStorage(addressBuffer, key)
    st.deepEqual(res, Buffer.alloc(0))

    const origRes = await stateManager.getOriginalContractStorage(addressBuffer, key)
    st.deepEqual(origRes, Buffer.alloc(0))

    await stateManager.commit()

    st.end()
  })

  t.test('should set original storage value', async (st) => {
    await stateManager.putContractStorage(addressBuffer, key, value)
    const res = await stateManager.getContractStorage(addressBuffer, key)
    st.deepEqual(res, value)

    st.end()
  })

  t.test('should get original storage value', async (st) => {
    const res = await stateManager.getOriginalContractStorage(addressBuffer, key)
    st.deepEqual(res, value)
    st.end()
  })

  t.test('should return correct original value after modification', async (st) => {
    const newValue = Buffer.from('1235', 'hex')
    await stateManager.putContractStorage(addressBuffer, key, newValue)
    const res = await stateManager.getContractStorage(addressBuffer, key)
    st.deepEqual(res, newValue)

    const origRes = await stateManager.getOriginalContractStorage(addressBuffer, key)
    st.deepEqual(origRes, value)
    st.end()
  })

  t.test('should cache keys separately', async (st) => {
    const key2 = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000012',
      'hex',
    )
    const value2 = Buffer.from('12', 'hex')
    const value3 = Buffer.from('123', 'hex')
    await stateManager.putContractStorage(addressBuffer, key2, value2)

    let res = await stateManager.getContractStorage(addressBuffer, key2)
    st.deepEqual(res, value2)
    let origRes = await stateManager.getOriginalContractStorage(addressBuffer, key2)
    st.deepEqual(origRes, value2)

    await stateManager.putContractStorage(addressBuffer, key2, value3)

    res = await stateManager.getContractStorage(addressBuffer, key2)
    st.deepEqual(res, value3)
    origRes = await stateManager.getOriginalContractStorage(addressBuffer, key2)
    st.deepEqual(origRes, value2)

    // Check previous key
    res = await stateManager.getContractStorage(addressBuffer, key)
    st.deepEqual(res, Buffer.from('1235', 'hex'))
    origRes = await stateManager.getOriginalContractStorage(addressBuffer, key)
    st.deepEqual(origRes, value)

    st.end()
  })

  t.test("getOriginalContractStorage should validate the key's length", async (st) => {
    try {
      await stateManager.getOriginalContractStorage(addressBuffer, Buffer.alloc(12))
    } catch (e) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })
})

tape('StateManager - Contract code', (tester) => {
  const it = tester.test

  it('should set and get code', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    const code = Buffer.from(
      '73095e7baea6a6c7c4c2dfeb977efac326af552d873173095e7baea6a6c7c4c2dfeb977efac326af552d873157',
      'hex',
    )
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xb30fb32201fe0486606ad451e1a61e2ae1748343cd3d411ed992ffcc0774edd4',
    }
    const account = new Account(raw)
    await stateManager.putAccount(address, account)
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    t.equals(Buffer.compare(code, codeRetrieved), 0)
    t.end()
  })

  it('should not get code if is not contract', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
    }
    const account = new Account(raw)
    await stateManager.putAccount(address, account)
    const code = await stateManager.getContractCode(address)
    t.equals(Buffer.compare(code, Buffer.alloc(0)), 0)
    t.end()
  })

  it('should set empty code', async (t) => {
    const stateManager = new DefaultStateManager()
    const address = Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex')
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
    }
    const account = new Account(raw)
    const code = Buffer.alloc(0)
    await stateManager.putAccount(address, account)
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    t.equals(Buffer.compare(codeRetrieved, Buffer.alloc(0)), 0)
    t.end()
  })
})
