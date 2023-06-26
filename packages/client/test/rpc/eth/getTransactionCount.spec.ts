import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

import type { FullEthereumService } from '../../../src/service'

const method = 'eth_getTransactionCount'

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

  // since synchronizer.run() is not executed in the mock setup,
  // manually run stateManager.generateCanonicalGenesis()
  await vm.stateManager.generateCanonicalGenesis(blockchain.genesisState())

  // a genesis address
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // verify nonce is 0
  let req = params(method, [address.toString(), 'latest'])
  let expectRes = (res: any) => {
    const msg = 'should return the correct nonce (0)'
    t.equal(res.body.result, '0x0', msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // construct block with tx
  const tx = LegacyTransaction.fromTxData({ gasLimit: 53000 }, { common, freeze: false })
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

  // verify nonce increments after a tx
  req = params(method, [address.toString(), 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return the correct nonce (1)'
    t.equal(res.body.result, '0x1', msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // call with nonexistent account
  req = params(method, [`0x${'11'.repeat(20)}`, 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return 0x0 for nonexistent account'
    t.equal(res.body.result, `0x0`, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unsupported block argument`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0xccfd725760a68823ff1e062f4cc97e1360e8d997', 'pending'])
  const expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})
