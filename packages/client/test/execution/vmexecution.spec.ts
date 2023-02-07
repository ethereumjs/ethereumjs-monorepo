import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain as ChainEnum, Common, Hardfork } from '@ethereumjs/common'
import { toBuffer } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import * as tape from 'tape'

import { Chain } from '../../lib/blockchain'
import { Config } from '../../lib/config'
import { VMExecution } from '../../lib/execution'
import blocksDataGoerli = require('../testdata/blocks/goerli.json')
import blocksDataMainnet = require('../testdata/blocks/mainnet.json')
import testnet = require('../testdata/common/testnet.json')

tape('[VMExecution]', async (t) => {
  t.test('Initialization', async (t) => {
    const vm = await VM.create()
    const config = new Config({ vm, transports: [] })
    const chain = new Chain({ config })
    const exec = new VMExecution({ config, chain })
    t.equals(exec.vm, vm, 'should use vm provided')
    t.end()
  })

  async function testSetup(blockchain: Blockchain, common?: Common) {
    const config = new Config({ common, transports: [], saveReceipts: true })
    const chain = new Chain({ config, blockchain })
    const exec = new VMExecution({ config, chain, metaDB: chain.chainDB })
    await chain.open()
    await exec.open()
    return exec
  }

  t.test('getReceipts', async (t) => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    const fakeHash = '0xd3671e9680944e99f3a01d5d0b12803f0e472abf2006e914daa84742b6341e6c'
    const exec = await testSetup(blockchain)
    await exec.run()
    await (exec.receiptsManager as any).put(0, toBuffer(fakeHash), Buffer.from([]))
    try {
      await exec.receiptsManager?.getReceipts(toBuffer(fakeHash), false, true)
      t.fail('getReceipts should throw error if target block not found')
    } catch (e: any) {
      t.equal(
        e.message,
        'Block not found',
        'getReceipts should throw error if target block not found'
      )
    }
    try {
      const block = blockchain.genesisBlock
      const fakeBlock = Block.fromBlockData({ header: { number: BigInt(1) } })
      await exec.receiptsManager?.getLogs(block, fakeBlock)
      t.fail('getLogs should throw error if target block not found')
    } catch (e: any) {
      t.equal(
        e.message,
        `Key ${BigInt(1)} was not found`,
        'getLogs should throw error if target block not found'
      )
    }
    t.end()
  })

  t.test('Block execution / Hardforks PoW (mainnet)', async (t) => {
    let blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    let exec = await testSetup(blockchain)
    const oldHead = await exec.vm.blockchain.getIteratorHead!()
    await exec.run()
    let newHead = await exec.vm.blockchain.getIteratorHead!()
    t.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksDataMainnet, {
      validateBlocks: true,
      validateConsensus: false,
    })
    exec = await testSetup(blockchain)
    await exec.run()
    newHead = await exec.vm.blockchain.getIteratorHead!()
    t.equals(newHead.header.number, BigInt(5), 'should run all blocks')

    const common = new Common({ chain: 'testnet', customChains: [testnet] })
    exec = await testSetup(blockchain, common)
    await exec.run()
    t.equal(exec.hardfork, 'byzantium', 'should update HF on block run')

    t.end()
  })

  t.test('Should fail opening if vmPromise already assigned', async (t) => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    const exec = await testSetup(blockchain)
    t.equal(exec.started, true, 'execution should be opened')
    await exec.stop()
    t.equal(exec.started, false, 'execution should be stopped')
    exec['vmPromise'] = (async () => 0)()
    await exec.open()
    t.equal(exec.started, false, 'execution should be stopped')
    exec['vmPromise'] = undefined
    await exec.open()
    t.equal(exec.started, true, 'execution should be restarted')
    exec['vmPromise'] = (async () => 0)()
    await exec.stop()
    t.equal(exec.started, false, 'execution should be restopped')
    t.equal(exec['vmPromise'], undefined, 'vmPromise should be reset')
    t.end()
  })

  t.test('Block execution / Hardforks PoA (goerli)', async (t) => {
    const common = new Common({ chain: ChainEnum.Goerli, hardfork: Hardfork.Chainstart })
    let blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    let exec = await testSetup(blockchain, common)
    const oldHead = await exec.vm.blockchain.getIteratorHead!()
    const oldHeadHash = oldHead instanceof Buffer ? oldHead : oldHead.hash()

    await exec.run()
    let newHead = await exec.vm.blockchain.getIteratorHead!()
    const newHeadHash = newHead instanceof Buffer ? newHead : newHead.hash()
    t.deepEqual(newHeadHash, oldHeadHash, 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksDataGoerli, {
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    exec = await testSetup(blockchain, common)
    await exec.run()
    newHead = await exec.vm.blockchain.getIteratorHead!()
    t.equals(newHead.header.number, BigInt(7), 'should run all blocks')

    t.end()
  })
})
