import { createBlockchainFromBlocksData } from '@ethereumjs/blockchain'
import { assert, describe, it } from 'vitest'

import { mainnetData } from '../../testdata/blocks/mainnet.js'
import { createClient, createManager, getRPCClient, startRPC, testSetup } from '../helpers.js'

import type { Blockchain } from '@ethereumjs/blockchain'

const method = 'debug_setHead'

describe(method, async () => {
  it('call with valid arguments', async () => {
    const blockchain = await createBlockchainFromBlocksData(mainnetData, {
      validateBlocks: true,
      validateConsensus: false,
    })
    const blocks = await blockchain.getBlocks(0, 6, 0, false)
    const exec = await testSetup(blockchain)
    await exec.run()
    const newHead = await (exec.vm.blockchain as Blockchain).getIteratorHead!()
    assert.equal(newHead.header.number, BigInt(5), 'should run all blocks')

    const a = await createClient({ blockchain })
    await a.service.skeleton?.open()
    ;(a.service.execution as any) = exec

    const manager = createManager(a)
    const rpc = getRPCClient(startRPC(manager.getMethods()))
    assert.equal(
      await a.service.skeleton?.headHash(),
      undefined,
      'should return undefined when head is not set',
    )
    for (let i = 0; i < blocks.length; i++) {
      await rpc.request(method, [`0x${i}`])
      assert.deepEqual(
        await a.service.skeleton?.headHash()!,
        blocks[i].header.hash(),
        `skeleton chain should return hash of block number ${i} set as head`,
      )
      assert.deepEqual(
        a.service.execution.chainStatus?.hash!,
        blocks[i].header.hash(),
        `vm execution should set hash to new head`,
      )
    }
  }, 30000)
})
