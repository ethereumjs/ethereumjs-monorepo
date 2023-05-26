import { Blockchain } from '@ethereumjs/blockchain'
import { Chain as ChainEnum, Common, Hardfork } from '@ethereumjs/common'
import { VM } from '@ethereumjs/vm'
import * as tape from 'tape'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { VMExecution } from '../../src/execution'
import blocksDataGoerli = require('../testdata/blocks/goerli.json')
import blocksDataMainnet = require('../testdata/blocks/mainnet.json')
import testnet = require('../testdata/common/testnet.json')

tape('[VMExecution]', async (t) => {
  t.test('Initialization', async (t) => {
    const vm = await VM.create()
    const config = new Config({ vm, transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const exec = new VMExecution({ config, chain })
    t.equals(exec.vm, vm, 'should use vm provided')
    t.end()
  })

  async function testSetup(blockchain: Blockchain, common?: Common) {
    const config = new Config({ common, transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config, blockchain })
    const exec = new VMExecution({ config, chain })
    await chain.open()
    await exec.open()
    return exec
  }

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
    await exec.run()
    let newHead = await exec.vm.blockchain.getIteratorHead!()
    t.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

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
