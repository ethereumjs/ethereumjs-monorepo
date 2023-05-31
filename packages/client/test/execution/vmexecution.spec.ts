import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain as ChainEnum, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import * as tape from 'tape'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { VMExecution } from '../../src/execution'
import { closeRPC, setupChain } from '../rpc/helpers'
import blocksDataGoerli = require('../testdata/blocks/goerli.json')
import blocksDataMainnet = require('../testdata/blocks/mainnet.json')
import testnet = require('../testdata/common/testnet.json')
import shanghaiJSON = require('../testdata/geth-genesis/withdrawals.json')

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

  t.test('Block execution / Hardforks PoA (goerli)', async (t) => {
    const { server, execution, blockchain } = await setupChain(shanghaiJSON, 'post-merge', {
      engine: true,
    })

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const block = await Block.fromExecutionPayload(shanghaiPayload)
    const oldHead = await blockchain.getIteratorHead()

    const parentStateRoot = oldHead.header.stateRoot
    await execution.runWithoutSetHead({ block, root: parentStateRoot })

    await blockchain.putBlock(block)
    await execution.run()

    const newHead = await blockchain.getIteratorHead()
    t.equal(
      bytesToHex(block.hash()),
      bytesToHex(newHead.hash()),
      'vmHead should be on the latest block'
    )

    closeRPC(server)
    t.end()
  })
})

const shanghaiPayload = {
  blockNumber: '0x1',
  parentHash: '0xfe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710',
  feeRecipient: '0xaa00000000000000000000000000000000000000',
  stateRoot: '0x23eadd91fca55c0e14034e4d63b2b3ed43f2e807b6bf4d276b784ac245e7fa3f',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x1c9c380',
  gasUsed: '0x0',
  timestamp: '0x2f',
  extraData: '0x',
  baseFeePerGas: '0x7',
  blockHash: '0xd30a8c821078a9153a5cbc5ac9a2c5baca7f7885496f1f461dbfcb8dbe1fa0c0',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  transactions: [],
  withdrawals: [
    {
      index: '0x0',
      validatorIndex: '0xffff',
      address: '0x0000000000000000000000000000000000000000',
      amount: '0x0',
    },
    {
      index: '0x1',
      validatorIndex: '0x10000',
      address: '0x0100000000000000000000000000000000000000',
      amount: '0x100000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x2',
      validatorIndex: '0x10001',
      address: '0x0200000000000000000000000000000000000000',
      amount: '0x200000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x3',
      validatorIndex: '0x10002',
      address: '0x0300000000000000000000000000000000000000',
      amount: '0x300000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x4',
      validatorIndex: '0x10003',
      address: '0x0400000000000000000000000000000000000000',
      amount: '0x400000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x5',
      validatorIndex: '0x10004',
      address: '0x0500000000000000000000000000000000000000',
      amount: '0x500000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x6',
      validatorIndex: '0x10005',
      address: '0x0600000000000000000000000000000000000000',
      amount: '0x600000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x7',
      validatorIndex: '0x10006',
      address: '0x0700000000000000000000000000000000000000',
      amount: '0x700000000000000000000000000000000000000000000000000000000000000',
    },
  ],
}
