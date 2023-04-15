/* eslint @typescript-eslint/no-unused-vars: 0 */
import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { StatelessVerkleStateManager } from '../src'
// import { createAccount, getTransaction } from '../utils'

//import { Address } from 'ethereumjs-util'
import * as verkleBlockJSON from './testdata/verkleBeverlyHillsBlock83.json'
import * as simpleVerkleBlockJSON from './testdata/verkleSampleBlock.json'

tape('StatelessVerkleStateManager', (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })
  const simpleBlock = Block.fromBlockData(simpleVerkleBlockJSON, { common })
  const block = Block.fromBlockData(verkleBlockJSON, { common })

  t.test('initPreState()', async (st) => {
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initPreState(simpleBlock.header.verkleProof!, simpleBlock.header.verklePreState!)

    const proofStart = '0x000000000600000008'
    st.equal((stateManager as any)._proof.slice(0, 20), proofStart, 'should initialize with proof')
    st.ok(Object.keys((stateManager as any)._state).length !== 0, 'should initialize with state')
  })

  // Test data from https://github.com/gballet/verkle-block-sample/tree/master#block-content
  t.test('getTreeKey()', async (st) => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initPreState(simpleBlock.header.verkleProof!, simpleBlock.header.verklePreState!)

    const balanceKey = await (stateManager as any).getTreeKeyForBalance(
      Address.fromString('0x0000000000000000000000000000000000000000')
    )
    st.equal(
      balanceKey.toString('hex'),
      'bf101a6e1c8e83c11bd203a582c7981b91097ec55cbd344ce09005c1f26d1901'
    )
  })

  t.test('getTreeKey()', async (st) => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initPreState(simpleBlock.header.verkleProof!, simpleBlock.header.verklePreState!)

    const balanceKey = await (stateManager as any).getTreeKeyForBalance(
      Address.fromString('0x71562b71999873DB5b286dF957af199Ec94617f7')
    )
    st.equal(
      balanceKey.toString('hex'),
      '274cde18dd9dbb04caf16ad5ee969c19fe6ca764d5688b5e1d419f4ac6cd1601'
    )
  })

  t.test('getAccount()', async (st) => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initPreState(simpleBlock.header.verkleProof!, simpleBlock.header.verklePreState!)

    const account = await stateManager.getAccount(
      Address.fromString('0x0000000000000000000000000000000000000000')
    )
    st.equal(account.balance, 2000000000000000999n, 'should have correct balance')
    st.equal(account.nonce, 0n, 'should have correct nonce')
    st.equal(
      account.storageRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot'
    )
    st.equal(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })

  t.test('getAccount()', async (st) => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initPreState(simpleBlock.header.verkleProof!, simpleBlock.header.verklePreState!)

    const account = await stateManager.getAccount(
      Address.fromString('0x71562b71999873DB5b286dF957af199Ec94617f7')
    )
    st.equal(account.balance, 999914074999998002n, 'should have correct balance')
    st.equal(account.nonce, 3n, 'should have correct nonce')
  })

  /**

  t.test('checkpoint() / commit() / revert', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

    const tx = getTransaction(common, 0, true)
    const caller = tx.getSenderAddress()
    const acc = createAccount()

    let stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState({
      accounts: {},
      code: {},
      storage: {},
    })
    await stateManager.checkpoint()
    st.equal((stateManager as any)._checkpoints.length, 1, 'should have set a checkpoint')

    await stateManager.putAccount(caller, acc)
    await stateManager.commit()
    st.equal((stateManager as any)._checkpoints.length, 0, 'should remove checkpoint on commit')
    let isInState =
      '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c' in (stateManager as any)._state.accounts
    st.ok(isInState, 'should have caller account in current state on commit')

    stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState({
      accounts: {},
      code: {},
      storage: {},
    })
    await stateManager.checkpoint()

    await stateManager.putAccount(caller, acc)
    await stateManager.revert()
    st.equal((stateManager as any)._checkpoints.length, 0, 'should remove checkpoint on revert')
    isInState =
      '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c' in (stateManager as any)._state.accounts
    st.ok(!isInState, 'should not have caller account in current state on revert')
  })

  t.test('putContractStorage() / getContractStorage() / clearContractStorage()', async (st) => {
    const stateManager = new StatelessVerkleStateManager()

    // Init pre state (format: address -> RLP serialized account)
    // Here: Caller address from `const tx = getTransaction(vm._common, 0, true)`
    const preState = {
      accounts: {
        '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c':
          'f8478083fff384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      },
      code: {},
      storage: {},
    }
    await stateManager.initPreState(preState)

    const address = Address.fromString('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c')
    const key = Buffer.alloc(32, 0)
    const val = Buffer.from('01', 'hex')
    await stateManager.putContractStorage(address, key, val)

    let valReceived = await stateManager.getContractStorage(address, key)
    st.deepEqual(valReceived, val, 'received correct storage value')

    await stateManager.clearContractStorage(address)
    valReceived = await stateManager.getContractStorage(address, key)
    st.deepEqual(valReceived, Buffer.alloc(0), 'received empty Buffer after clearing')
  })

  t.test('should run simple transfer-tx (stateful)', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    const vm = new VM({ common })
    const tx = getTransaction(vm._common, 0, true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx })
    st.pass('Ok, that is something. Passed in stateful mode.')
  })

  t.test('should run simple transfer-tx (stateless)', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

    // Init pre state (format: address -> RLP serialized account)
    // Here: Caller address -> Account from tx created below
    const preState = {
      accounts: {
        '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c':
          'f8478083fff384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      },
      code: {},
      storage: {},
    }
    const stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState(preState)

    const vm = new VM({ common, stateManager })
    const tx = getTransaction(vm._common, 0, true)

    const res = await vm.runTx({ tx })

    let address = Address.fromString('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c')
    let account = await stateManager.getAccount(address)
    st.equal(account.nonce.toString('hex'), '1', 'should correctly update caller nonce')

    address = Address.fromString('0x0000000000000000000000000000000000000000')
    account = await stateManager.getAccount(address)
    let msg = 'should correctly update miner account balance'
    st.equal(account.balance.toString('hex'), '1e2418')

    msg = 'should correctly update underlying state datastructure'
    st.ok(
      '0x0000000000000000000000000000000000000000' in (stateManager as any)._state.accounts,
      `${msg}, accounts`
    )
    st.pass('Whohoo, tx passed in stateless mode!!!')
  })

  t.test('should run simple code-tx (stateful)', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    const vm = new VM({ common })
    const tx = getTransaction(vm._common, 0, true, '0x00', true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx })
    st.pass('Ok, that is something. Passed in stateful mode.')
  })

  t.test('should run simple contract-tx (stateless)', async (st) => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

    // Init pre state (format: address -> RLP serialized account)
    // Here: Caller address -> Account from tx created below
    const preState = {
      accounts: {
        '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c':
          'f8478083fff384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      },
      code: {},
      storage: {},
    }
    const stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState(preState)

    const vm = new VM({ common, stateManager })
    const tx = getTransaction(vm._common, 0, true, '0x00', true)

    const res = await vm.runTx({ tx })

    let address = Address.fromString('0xbe862ad9abfe6f22bcb087716c7d89a26051f74c')
    let account = await stateManager.getAccount(address)
    st.equal(account.nonce.toString('hex'), '1', 'should correctly update caller nonce')

    address = Address.fromString('0x0000000000000000000000000000000000000000')
    account = await stateManager.getAccount(address)
    let msg = 'should correctly update miner account balance'
    st.equal(account.balance.toString('hex'), '5edd5a')

    msg = 'should correctly update underlying state datastructure'
    st.ok(
      '0x0000000000000000000000000000000000000000' in (stateManager as any)._state.accounts,
      `${msg}, accounts`
    )
    st.equal(
      (stateManager as any)._state.code[
        '0x8ba225ea8d12294db5a6a470baaea45e7f5ceba89a0ea0cb6d4c171f3ca2366f'
      ],
      '6080604052600080fdfea265627a7a723158204aed884a44fd1747efccba1447a2aa2d9a4b06dd6021c4a3bbb993021e0a909e64736f6c634300050f0032',
      `${msg}, code`
    )

    st.pass('Whohoo, tx passed in stateless mode!!!')
  })*/
})
