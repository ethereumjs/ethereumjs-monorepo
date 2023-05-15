import { Block, BlockHeader } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { TransactionFactory } from '@ethereumjs/tx'
import { randomBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

import type { FullEthereumService } from '../../../lib/service'

const method = 'txpool_content'

tape(`${method}: call with valid arguments`, async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
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
  const gasLimit = 2000000
  const parent = await blockchain.getCanonicalHeadHeader()
  const block = Block.fromBlockData(
    {
      header: {
        parentHash: parent.hash(),
        number: 1,
        gasLimit,
      },
    },
    { common, calcDifficultyFromHeader: parent }
  )

  let ranBlock: Block | undefined = undefined
  vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  await vm.runBlock({ block, generate: true, skipBlockValidation: true })
  await vm.blockchain.putBlock(ranBlock!)
  const service = client.services[0] as FullEthereumService
  service.execution.vm._common.setHardfork('london')
  service.chain.config.chainCommon.setHardfork('london')
  const headBlock = await service.chain.getCanonicalHeadBlock()
  const londonBlock = Block.fromBlockData(
    {
      header: BlockHeader.fromHeaderData(
        {
          baseFeePerGas: 1000000000n,
          number: 2n,
          parentHash: headBlock.header.hash(),
        },
        {
          common: service.chain.config.chainCommon,
          skipConsensusFormatValidation: true,
          calcDifficultyFromHeader: headBlock.header,
        }
      ),
    },
    { common: service.chain.config.chainCommon }
  )

  vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  await vm.runBlock({ block: londonBlock, generate: true, skipBlockValidation: true })
  await vm.blockchain.putBlock(ranBlock!)
  ;(service.txPool as any).validate = () => {}
  await service.txPool.add(TransactionFactory.fromTxData({ type: 2 }, {}).sign(randomBytes(32)))

  const req = params(method, [])
  const expectedRes = (res: any) => {
    t.equal(
      Object.keys(res.body.result.pending).length,
      1,
      'received one pending transaction back from response'
    )
  }

  await baseRequest(t, server, req, 200, expectedRes)
})
