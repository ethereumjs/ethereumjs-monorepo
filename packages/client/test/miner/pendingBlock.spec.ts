import tape from 'tape'
import td from 'testdouble'
import Common, { Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { BlockHeader } from '@ethereumjs/block'
import VM from '@ethereumjs/vm'
import { DefaultStateManager, StateManager } from '@ethereumjs/statemanager'
import { Address } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { TxPool } from '../../lib/sync/txpool'
import { PendingBlock } from '../../lib/miner'

const A = {
  address: new Address(Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex')),
  privateKey: Buffer.from(
    '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
    'hex'
  ),
}

const B = {
  address: new Address(Buffer.from('6f62d8382bf2587361db73ceca28be91b2acb6df', 'hex')),
  privateKey: Buffer.from(
    '2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6',
    'hex'
  ),
}

const setBalance = async (stateManager: StateManager, address: Address, balance: bigint) => {
  await stateManager.checkpoint()
  await stateManager.modifyAccountFields(address, { balance })
  await stateManager.commit()
}

tape('[PendingBlock]', async (t) => {
  const originalValidate = BlockHeader.prototype.validate
  BlockHeader.prototype.validate = td.func<any>()
  td.replace('@ethereumjs/block', { BlockHeader })

  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  DefaultStateManager.prototype.setStateRoot = td.func<any>()
  td.replace('@ethereumjs/vm/dist/state', { DefaultStateManager })

  const common = new Common({ chain: CommonChain.Rinkeby, hardfork: Hardfork.Berlin })
  const config = new Config({ transports: [], common })

  const createTx = (
    from = A,
    to = B,
    nonce = 0,
    value = 1,
    gasPrice = 1000000000,
    gasLimit = 100000
  ) => {
    const txData = {
      nonce,
      gasPrice,
      gasLimit,
      to: to.address,
      value,
    }
    const tx = Transaction.fromTxData(txData, { common })
    const signedTx = tx.sign(from.privateKey)
    return signedTx
  }

  const txA01 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA02 = createTx(A, B, 1, 1, 2000000000) // A -> B, nonce: 1, value: 1, 2x gasPrice
  const txB01 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice

  t.test('should start and build', async (t) => {
    const txPool = new TxPool({ config })
    txPool.add(txA01)
    txPool.add(txA02)
    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    await setBalance(vm.stateManager, A.address, BigInt(5000000000000000))
    await setBalance(vm.stateManager, B.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.length, 1, 'should set the pending payload')
    txPool.add(txB01)
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block, receipts] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(block?.transactions.length, 3, 'should include txs from pool')
    t.equal(receipts.length, 3, 'receipts should match number of transactions')
    t.equal(pendingBlock.pendingPayloads.length, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should start and stop', async (t) => {
    const txPool = new TxPool({ config })
    txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    await setBalance(vm.stateManager, A.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.length, 1, 'should set the pending payload')
    pendingBlock.stop(payloadId)
    t.equal(
      pendingBlock.pendingPayloads.length,
      0,
      'should reset the pending payload after stopping'
    )
    t.end()
  })

  t.test('should stop adding txs when block is full', async (t) => {
    const txPool = new TxPool({ config })
    txPool.add(txA01)
    txPool.add(txA02)
    const txA03 = Transaction.fromTxData(
      {
        data: '0xFE', // INVALID opcode, uses all gas
        gasLimit: 10000000,
        nonce: 2,
      },
      { common }
    ).sign(A.privateKey)
    txPool.add(txA03)
    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    await setBalance(vm.stateManager, A.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.length, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block, receipts] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(block?.transactions.length, 2, 'should include txs from pool that fit in the block')
    t.equal(receipts.length, 2, 'receipts should match number of transactions')
    t.equal(pendingBlock.pendingPayloads.length, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should not add tx that errors (sender with insufficient funds)', async (t) => {
    const txPool = new TxPool({ config })
    txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.length, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block, receipts] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(
      block.transactions.length,
      0,
      'should not include tx with sender that has insufficient funds'
    )
    t.equal(receipts.length, 0, 'receipts should match number of transactions')
    t.equal(pendingBlock.pendingPayloads.length, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should reset td', (t) => {
    td.reset()
    // according to https://github.com/testdouble/testdouble.js/issues/379#issuecomment-415868424
    // mocking indirect dependencies is not properly supported, but it works for us in this file,
    // so we will replace the original functions to avoid issues in other tests that come after
    BlockHeader.prototype.validate = originalValidate
    DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
    t.end()
  })
})
