import tape from 'tape-catch'
import VM from '@ethereumjs/vm'
import Blockchain from '@ethereumjs/blockchain'
import { Config } from '../../../lib/config'
import { Chain } from '../../../lib/blockchain'
import { VMExecution } from '../../../lib/sync/execution/vmexecution'
import blocksData from './../../testdata/blocks_mainnet.json'

tape('[VMExecution]', async (t) => {
  t.test('should initialize with VM provided by config', async (t) => {
    const vm = new VM()
    const config = new Config({ vm, loglevel: 'error', transports: [] })
    const chain = new Chain({ config })
    const exec = new VMExecution({
      config,
      chain,
    })
    t.equals(exec.vm, vm, 'provided VM is used')
    t.end()
  })

  function initWithBlockchain(blockchain: Blockchain) {
    const vm = new VM()
    //vm.runBlockchain = td.func<any>()
    const config = new Config({ vm, loglevel: 'error', transports: [] })
    const chain = new Chain({ config, blockchain })
    const exec = new VMExecution({
      config,
      chain,
    })
    exec.syncing = true
    return exec
  }

  t.test('should run blocks', async (t) => {
    let blockchain = new Blockchain({
      validateBlocks: true,
      validateConsensus: false,
    })
    let exec = initWithBlockchain(blockchain)
    const oldHead = await exec.vm.blockchain.getHead()
    await exec.run()
    let newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on emtpy run')

    blockchain = await Blockchain.fromBlocksData(blocksData, {
      validateBlocks: true,
      validateConsensus: false,
    })
    exec = initWithBlockchain(blockchain)
    await exec.run()
    newHead = await exec.vm.blockchain.getHead()
    t.deepEqual(newHead.header.number.toNumber(), 5, 'should run all blocks')

    t.end()
  })
})
