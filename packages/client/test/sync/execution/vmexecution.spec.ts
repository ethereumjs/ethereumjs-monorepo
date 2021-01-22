import tape from 'tape-catch'
import td from 'testdouble'
import { BN } from 'ethereumjs-util'
import VM from '@ethereumjs/vm'
import Blockchain from '@ethereumjs/blockchain'
import { Config } from '../../../lib/config'
import { Chain } from '../../../lib/blockchain'
import { VMExecution } from '../../../lib/sync/execution/vmexecution'

tape('[FullSynchronizer]', async (t) => {
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

  t.test('should run blocks', async (t) => {
    const vm = new VM()
    vm.runBlockchain = td.func<any>()
    const config = new Config({ vm, loglevel: 'error', transports: [] })
    const blockchain = new Blockchain() as any
    const chain = new Chain({ config, blockchain })
    const exec = new VMExecution({
      config,
      chain,
    })
    const oldHead = exec.vm.blockchain.getHead()
    await exec.runBlocks()
    t.deepEqual(exec.vm.blockchain.getHead(), oldHead, 'should not modify blockchain on emtpy run')

    blockchain.getHead = td.func<any>()
    const getHeadResponse: any = []
    for (let i = 2; i <= 100; i++) {
      getHeadResponse.push({
        hash: () => {
          return Buffer.from(`hash${i}`)
        },
        header: { number: new BN(i) },
        transactions: [i],
      })
    }

    td.when(blockchain.getHead()).thenResolve(
      {
        hash: () => {
          return Buffer.from('hash0')
        },
        header: { number: new BN(1) },
        transactions: [],
      },
      ...getHeadResponse
    )
    t.equal(await exec.runBlocks(), 49)

    t.end()
  })
})
