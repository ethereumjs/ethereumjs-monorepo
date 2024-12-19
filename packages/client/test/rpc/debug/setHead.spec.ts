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
    assert.equal(newHead.header.number, BigInt(mainnetData.length), 'should run all blocks')

    const client = await createClient({ blockchain })
    await client.service.skeleton?.open()
    ;(client.service.execution as any) = exec

    const manager = createManager(client)
    const rpc = getRPCClient(startRPC(manager.getMethods()))
    assert.equal(
      await client.service.skeleton?.headHash(),
      undefined,
      'should return undefined when head is not set',
    )
    for (let i = 0; i < blocks.length; i++) {
      await rpc.request(method, [`0x${i}`])
      assert.deepEqual(
        await client.service.skeleton?.headHash()!,
        blocks[i].header.hash(),
        `skeleton chain should return hash of block number ${i} set as head`,
      )
      assert.deepEqual(
        client.service.execution.chainStatus?.hash!,
        blocks[i].header.hash(),
        `vm execution should set hash to new head`,
      )
    }
  }, 30000)

  it('should return error for pending block', async () => {
    const blockchain = await createBlockchainFromBlocksData(mainnetData, {
      validateBlocks: true,
      validateConsensus: false,
    })

    const client = await createClient({ blockchain })

    const manager = createManager(client)
    const rpc = getRPCClient(startRPC(manager.getMethods()))
    const result = await rpc.request(method, ['pending'])
    assert.equal(result.error.code, -32602)
    assert.equal(result.error.message, '"pending" is not supported')
  })

  it('should handle internal errors', async () => {
    const blockchain = await createBlockchainFromBlocksData(mainnetData, {
      validateBlocks: true,
      validateConsensus: false,
    })
    const blocks = await blockchain.getBlocks(0, 6, 0, false)
    const exec = await testSetup(blockchain)
    await exec.run()
    const newHead = await (exec.vm.blockchain as Blockchain).getIteratorHead!()
    assert.equal(newHead.header.number, BigInt(mainnetData.length), 'should run all blocks')

    const client = await createClient({ blockchain })
    ;(client.service.skeleton as any) = {
      open: async () => {
        throw new Error('open failed')
      },
    }

    const manager = createManager(client)
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    for (let i = 0; i < blocks.length; i++) {
      const result = await rpc.request(method, [`0x${i}`])
      assert.equal(result.error.code, -32603)
      assert.equal(result.error.message, 'Internal error')
    }
  })
})
