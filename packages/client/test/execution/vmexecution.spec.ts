import tape from 'tape'
import Blockchain from '@ethereumjs/blockchain'
import Common, { Chain as ChainEnum, Hardfork } from '@ethereumjs/common'
import VM from '@ethereumjs/vm'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { VMExecution } from '../../lib/execution'
import blocksDataMainnet from '../testdata/blocks/mainnet.json'
import blocksDataGoerli from '../testdata/blocks/goerli.json'
import testnet from '../testdata/common/testnet.json'

tape('[VMExecution]', async (t) => {
  t.test('Initialization', async (t) => {
    const vm = new VM()
    const config = new Config({ vm, transports: [] })
    const chain = new Chain({ config })
    const exec = new VMExecution({ config, chain })
    t.equals(exec.vm, vm, 'should use vm provided')
    t.end()
  })

  async function testSetup(blockchain: Blockchain, common?: Common) {
    const config = new Config({ common, transports: [] })
    const chain = new Chain({ config, blockchain })
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
    const oldHead = await exec.vm.blockchain.getHead()
    await exec.run()
    let newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksDataMainnet, {
      validateBlocks: true,
      validateConsensus: false,
    })
    exec = await testSetup(blockchain)
    await exec.run()
    newHead = await exec.vm.blockchain.getHead()
    t.ok(newHead.header.number.eqn(5), 'should run all blocks')

    const common = new Common({ chain: 'testnet', customChains: [testnet] })
    exec = await testSetup(blockchain, common)
    await exec.run()
    t.equal(exec.hardfork, 'byzantium', 'should update HF on block run')

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
    const oldHead = await exec.vm.blockchain.getHead()
    await exec.run()
    let newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksDataGoerli, {
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    exec = await testSetup(blockchain, common)
    await exec.run()
    newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.header.number.toNumber(), 7, 'should run all blocks')

    t.end()
  })
})
