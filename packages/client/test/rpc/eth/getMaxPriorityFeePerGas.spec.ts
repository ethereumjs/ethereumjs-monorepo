import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'
//import { createFeeMarket1559Tx } from '@ethereumjs/tx'

const method = 'eth_getMaxPriorityFeePerGas'

interface Block {
  transactions: any[]
  hash: () => Uint8Array
}

function createBlock(_blockMPF: bigint[]): Block {
  return {
    transactions: [],
    hash: () => new Uint8Array([1]),
  }
}

function createChain(blocksMPF: bigint[][] = [[]]) {
  /*const tx = createFeeMarket1559Tx({
    maxPriorityFeePerGas: 123456789n,
  })*/
  if (blocksMPF.length === 0) {
    throw new Error('call with minimum 1 block')
  }

  const blocks: Block[] = []

  for (const blockMPF of blocksMPF) {
    const block = createBlock(blockMPF)
    blocks.push(block)
  }
  const latest = blocks[blocks.length - 1]
  return {
    getCanonicalHeadBlock: () => latest,
    getBlocks: () => blocks,
  }
}

describe(method, () => {
  it('should return 0 for a simple block with no transactions', async () => {
    const client = await createClient({ chain: createChain() })
    const manager = createManager(client)
    const rpcServer = startRPC(manager.getMethods())
    const rpc = getRPCClient(rpcServer)

    client.config.synchronized = true

    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x0')
  })
})
