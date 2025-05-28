import { assert, describe, it } from 'vitest'

import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import type { FeeMarket1559Tx } from '@ethereumjs/tx'
import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'
//import { createFeeMarket1559Tx } from '@ethereumjs/tx'

const method = 'eth_getMaxPriorityFeePerGas'

interface Block {
  transactions: any[]
  hash: () => Uint8Array
}

type BlocksMPF = bigint[][]

function createBlock(blockMPF: bigint[]): Block {
  const transactions: FeeMarket1559Tx[] = []
  for (const mpf of blockMPF) {
    const tx = createFeeMarket1559Tx({
      maxFeePerGas: mpf, // Side addition to satisfy tx creation
      maxPriorityFeePerGas: mpf,
    })
    transactions.push(tx)
  }

  return {
    transactions,
    hash: () => new Uint8Array([1]),
  }
}

function createChain(blocksMPF: BlocksMPF = [[]]) {
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

async function getSetup(blocksMPF: BlocksMPF) {
  const client = await createClient({ chain: createChain(blocksMPF) })
  client.config.synchronized = true
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())
  const rpc = getRPCClient(rpcServer)
  return { client, manager, rpcServer, rpc }
}

describe(method, () => {
  it('should return 0 for a simple block with no transactions', async () => {
    const blocksMPF = [[]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x0')
  })

  it('should return "itself" for a simple block with one 1559 tx', async () => {
    const blocksMPF = [[100n]] // 0x64
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x64')
  })
})
