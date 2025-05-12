import { createBlock, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createTx } from '@ethereumjs/tx'
import { Units, randomBytes } from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

import type { Block } from '@ethereumjs/block'

const method = 'txpool_content'

describe(method, () => {
  it('call with valid arguments', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
    const blockchain = await createBlockchain({
      common,
      validateBlocks: false,
      validateConsensus: false,
    })

    const client = await createClient({ blockchain, commonChain: common, includeVM: true })
    const manager = createManager(client)
    const rpc = getRPCClient(startRPC(manager.getMethods()))
    const { execution } = client.service
    assert.notEqual(execution, undefined, 'should have valid execution')
    const { vm } = execution
    await vm.stateManager.generateCanonicalGenesis!(getGenesis(1))
    const gasLimit = 2000000
    const parent = await blockchain.getCanonicalHeadHeader()
    const block = createBlock(
      {
        header: {
          parentHash: parent.hash(),
          number: 1,
          gasLimit,
        },
      },
      { common, calcDifficultyFromHeader: parent },
    )

    let ranBlock: Block | undefined = undefined
    vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    await vm.blockchain.putBlock(ranBlock!)
    const service = client.service
    service.execution.vm.common.setHardfork('london')
    service.chain.config.chainCommon.setHardfork('london')
    const headBlock = await service.chain.getCanonicalHeadBlock()
    const londonBlock = createBlock(
      {
        header: createBlockHeader(
          {
            baseFeePerGas: Units.gwei(1),
            number: 2n,
            parentHash: headBlock.header.hash(),
          },
          {
            common: service.chain.config.chainCommon,
            skipConsensusFormatValidation: true,
            calcDifficultyFromHeader: headBlock.header,
          },
        ),
      },
      { common: service.chain.config.chainCommon },
    )

    vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    await runBlock(vm, { block: londonBlock, generate: true, skipBlockValidation: true })
    await vm.blockchain.putBlock(ranBlock!)
    /// @ts-expect-error -- Simple config for testing
    service.txPool.validate = () => {}
    await service.txPool.add(createTx({ type: 2 }, {}).sign(randomBytes(32)))

    const res = await rpc.request(method, [])
    assert.strictEqual(
      Object.keys(res.result.pending).length,
      1,
      'received one pending transaction back from response',
    )
  })
})
