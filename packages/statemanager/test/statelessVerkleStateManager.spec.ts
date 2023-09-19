import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { Address, bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { StatelessVerkleStateManager } from '../src/index.js'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockJSON from './testdata/verkleKaustinenBlock1.json'

describe('StatelessVerkleStateManager: Kaustinen Verkle Block', () => {
  const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
    chain: 'customChain',
    eips: [6800],
  })
  const block = Block.fromBlockData(verkleBlockJSON, { common })

  it('initPreState()', async () => {
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initVerkleExecutionWitness(block.header.executionWitness!)

    assert.ok(
      Object.keys((stateManager as any)._state).length !== 0,
      'should initialize with state'
    )
  })

  it('getTreeKey()', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.executionWitness!)

    const balanceKey = stateManager.getTreeKeyForBalance(
      Address.fromString('0x0000000000000000000000000000000000000000')
    )
    assert.equal(
      bytesToHex(balanceKey),
      'bf101a6e1c8e83c11bd203a582c7981b91097ec55cbd344ce09005c1f26d1901'
    )
  })

  it('getTreeKey()', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.executionWitness!)

    const balanceKey = stateManager.getTreeKeyForBalance(
      Address.fromString('0x71562b71999873DB5b286dF957af199Ec94617f7')
    )
    assert.equal(
      bytesToHex(balanceKey),
      '274cde18dd9dbb04caf16ad5ee969c19fe6ca764d5688b5e1d419f4ac6cd1601'
    )
  })

  it('getAccount()', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.executionWitness!)

    const account = await stateManager.getAccount(
      Address.fromString('0x9791ded6e5d3d5dafca71bb7bb2a14187d17e32e')
    )

    assert.equal(account.balance, 5353969573687549266n, 'should have correct balance')
    assert.equal(account.nonce, 3963257n, 'should have correct nonce')
    assert.equal(
      bytesToHex(account.storageRoot),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot'
    )
    assert.equal(
      bytesToHex(account.codeHash),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })
})

/**

  it('checkpoint() / commit() / revert', async () => {
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
    assert.equal((stateManager as any)._checkpoints.length, 1, 'should have set a checkpoint')

    await stateManager.putAccount(caller, acc)
    await stateManager.commit()
    assert.equal((stateManager as any)._checkpoints.length, 0, 'should remove checkpoint on commit')
    let isInState =
      '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c' in (stateManager as any)._state.accounts
    assert.ok(isInState, 'should have caller account in current state on commit')

    stateManager = new StatelessVerkleStateManager({ common })
    await stateManager.initPreState({
      accounts: {},
      code: {},
      storage: {},
    })
    await stateManager.checkpoint()

    await stateManager.putAccount(caller, acc)
    await stateManager.revert()
    assert.equal((stateManager as any)._checkpoints.length, 0, 'should remove checkpoint on revert')
    isInState =
      '0xbe862ad9abfe6f22bcb087716c7d89a26051f74c' in (stateManager as any)._state.accounts
    assert.ok(!isInState, 'should not have caller account in current state on revert')
  })

  it('putContractStorage() / getContractStorage() / clearContractStorage()', async () => {
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
    assert.deepEqual(valReceived, val, 'received correct storage value')

    await stateManager.clearContractStorage(address)
    valReceived = await stateManager.getContractStorage(address, key)
    assert.deepEqual(valReceived, Buffer.alloc(0), 'received empty Buffer after clearing')
  })

  it('should run simple transfer-tx (stateful)', async () => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    const vm = new VM({ common })
    const tx = getTransaction(vm._common, 0, true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx })
    assert.pass('Ok, that is something. Passed in stateful mode.')
  })

  it('should run simple transfer-tx (stateless)', async () => {
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
    assert.equal(account.nonce.toString('hex'), '1', 'should correctly update caller nonce')

    address = Address.fromString('0x0000000000000000000000000000000000000000')
    account = await stateManager.getAccount(address)
    let msg = 'should correctly update miner account balance'
    assert.equal(account.balance.toString('hex'), '1e2418')

    msg = 'should correctly update underlying state datastructure'
    assert.ok(
      '0x0000000000000000000000000000000000000000' in (stateManager as any)._state.accounts,
      `${msg}, accounts`
    )
    assert.pass('Whohoo, tx passed in stateless mode!!!')
  })

  it('should run simple code-tx (stateful)', async () => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    const vm = new VM({ common })
    const tx = getTransaction(vm._common, 0, true, '0x00', true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx })
    assert.pass('Ok, that is something. Passed in stateful mode.')
  })

  it('should run simple contract-tx (stateless)', async () => {
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
    assert.equal(account.nonce.toString('hex'), '1', 'should correctly update caller nonce')

    address = Address.fromString('0x0000000000000000000000000000000000000000')
    account = await stateManager.getAccount(address)
    let msg = 'should correctly update miner account balance'
    assert.equal(account.balance.toString('hex'), '5edd5a')

    msg = 'should correctly update underlying state datastructure'
    assert.ok(
      '0x0000000000000000000000000000000000000000' in (stateManager as any)._state.accounts,
      `${msg}, accounts`
    )
    assert.equal(
      (stateManager as any)._state.code[
        '0x8ba225ea8d12294db5a6a470baaea45e7f5ceba89a0ea0cb6d4c171f3ca2366f'
      ],
      '6080604052600080fdfea265627a7a723158204aed884a44fd1747efccba1447a2aa2d9a4b06dd6021c4a3bbb993021e0a909e64736f6c634300050f0032',
      `${msg}, code`
    )

    assert.pass('Whohoo, tx passed in stateless mode!!!')
  })*/
// })
