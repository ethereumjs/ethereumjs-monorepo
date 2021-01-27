import tape from 'tape-catch'
import VM from '@ethereumjs/vm'
import Blockchain from '@ethereumjs/blockchain'
import { Config } from '../../../lib/config'
import { Chain } from '../../../lib/blockchain'
import { VMExecution } from '../../../lib/sync/execution/vmexecution'
import blocksData from './../../testdata/blocks_mainnet.json'
import testnet from './../../testdata/testnet.json'
import Common from '@ethereumjs/common'

tape('[VMExecution]', async (t) => {
  t.test('Initialization', async (t) => {
    const vm = new VM()
    const config = new Config({ vm, loglevel: 'error', transports: [] })
    const chain = new Chain({ config })
    const exec = new VMExecution({
      config,
      chain,
    })
    t.equals(exec.vm, vm, 'should use vm provided')
    t.end()
  })

  async function testSetup(blockchain: Blockchain, common?: Common) {
    const config = new Config({ common, loglevel: 'error', transports: [] })

    const chain = new Chain({ config, blockchain })
    const exec = new VMExecution({
      config,
      chain,
    })
    exec.syncing = true
    await exec.open()
    return exec
  }

  t.test('Block execution / Hardforks', async (t) => {
    let blockchain = new Blockchain({
      validateBlocks: true,
      validateConsensus: false,
    })
    let exec = await testSetup(blockchain)
    const oldHead = await exec.vm.blockchain.getHead()
    await exec.run()
    let newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksData, {
      validateBlocks: true,
      validateConsensus: false,
    })
    exec = await testSetup(blockchain)
    await exec.run()
    newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.header.number.toNumber(), 5, 'should run all blocks')

    const common = new Common({ chain: 'testnet', customChains: [testnet] })
    exec = await testSetup(blockchain, common)
    await exec.run()
    t.equal(exec.hardfork, 'byzantium', 'should update HF on block run')

    t.end()
  })
})
