import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

import type { FullEthereumService } from '../../../src/service'

const method = 'eth_getBlockTransactionCountByNumber'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
  })

  const client = createClient({ blockchain, commonChain: common, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
  t.notEqual(execution, undefined, 'should have valid execution')
  const { vm } = execution

  await vm.stateManager.generateCanonicalGenesis(blockchain.genesisState())

  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // construct block with tx
  const tx = Transaction.fromTxData({ gasLimit: 53000 }, { common, freeze: false })
  tx.getSenderAddress = () => {
    return address
  }
  const parent = await blockchain.getCanonicalHeadHeader()
  const block = Block.fromBlockData(
    {
      header: {
        parentHash: parent.hash(),
        number: 1,
        gasLimit: 2000000,
      },
    },
    { common, calcDifficultyFromHeader: parent }
  )
  block.transactions[0] = tx

  let ranBlock: Block | undefined = undefined
  vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  await vm.runBlock({ block, generate: true, skipBlockValidation: true })
  await vm.blockchain.putBlock(ranBlock!)

  // verify that the transaction count is 1
  const req = params(method, ['latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct block transaction count(1)'
    t.equal(res.body.result, '0x1', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid arguments (multiple transactions)`, async (t) => {
  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
  })

  const client = createClient({ blockchain, commonChain: common, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
  t.notEqual(execution, undefined, 'should have valid execution')
  const { vm } = execution

  await vm.stateManager.generateCanonicalGenesis(blockchain.genesisState())

  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // construct block with tx
  const tx = Transaction.fromTxData({ gasLimit: 53000 }, { common, freeze: false })
  tx.getSenderAddress = () => {
    return address
  }
  const tx2 = Transaction.fromTxData({ gasLimit: 53000, nonce: 1 }, { common, freeze: false })
  tx2.getSenderAddress = () => {
    return address
  }
  const tx3 = Transaction.fromTxData({ gasLimit: 53000, nonce: 2 }, { common, freeze: false })
  tx3.getSenderAddress = () => {
    return address
  }

  const parent = await blockchain.getCanonicalHeadHeader()
  const block = Block.fromBlockData(
    {
      header: {
        parentHash: parent.hash(),
        number: 1,
        gasLimit: 2000000,
      },
    },
    { common, calcDifficultyFromHeader: parent }
  )
  block.transactions[0] = tx
  block.transactions[1] = tx2
  block.transactions[2] = tx3

  let ranBlock: Block | undefined = undefined
  vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  await vm.runBlock({ block, generate: true, skipBlockValidation: true })
  await vm.blockchain.putBlock(ranBlock!)

  // verify that the transaction count is 3
  // specify the block number instead of using latest
  const req = params(method, ['0x1'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct block transaction count(3)'
    t.equal(res.body.result, '0x3', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unsupported block argument`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const req = params(method, ['pending'])
  const expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})
