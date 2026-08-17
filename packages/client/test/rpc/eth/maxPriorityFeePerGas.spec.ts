import { assert, describe, it } from 'vitest'

import { createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
import type { TypedTransaction } from '@ethereumjs/tx'
import { Units, hexToBigInt } from '@ethereumjs/util'
import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'eth_maxPriorityFeePerGas'

type BlocksMPF = bigint[][]

interface Block {
  transactions: TypedTransaction[]
  hash: () => Uint8Array
}
/**
 * @param blockMPF - Representing txs with the respective maxPriorityFeePerGas values
 * @param non1559Txs - Number of non-1559 txs to add to the block
 * @returns A block representation with the transactions and a hash
 */
function createBlock(blockMPF: bigint[], non1559Txs = 0): Block {
  const transactions: TypedTransaction[] = []
  for (const mpf of blockMPF) {
    const tx = createFeeMarket1559Tx({
      maxFeePerGas: mpf, // Side addition to satisfy tx creation
      maxPriorityFeePerGas: mpf,
    })
    transactions.push(tx)
  }
  for (let i = 0; i < non1559Txs; i++) {
    const tx = createLegacyTx({})
    transactions.push(tx)
  }

  return {
    transactions,
    hash: () => new Uint8Array([1]),
  }
}

function createChain(blocksMPF: BlocksMPF = [[]], non1559Txs = 0) {
  if (blocksMPF.length === 0) {
    throw new Error('call with minimum 1 block')
  }

  const blocks: Block[] = []

  for (const blockMPF of blocksMPF) {
    const block = createBlock(blockMPF, non1559Txs)
    blocks.push(block)
  }
  const latest = blocks[blocks.length - 1]
  return {
    getCanonicalHeadBlock: () => latest,
    getBlocks: () => blocks.reverse(), // needs to be returned in reverse order to simulate reverse flag
  }
}

async function getSetup(blocksMPF: BlocksMPF, non1559Txs = 0) {
  const client = await createClient({ chain: createChain(blocksMPF, non1559Txs) })
  client.config.synchronized = true
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())
  const rpc = getRPCClient(rpcServer)
  return { client, manager, rpcServer, rpc }
}

describe(method, () => {
  it('should return default for a simple block with no transactions', async () => {
    const blocksMPF = [[]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), Units.gwei(1n))
  })

  it('should return "100" for a simple block with one 1559 tx', async () => {
    const blocksMPF = [[100n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 100n)
  })

  it('should return 0 for a simple block with one non-1559 tx', async () => {
    const blocksMPF = [[]]
    const { rpc } = await getSetup(blocksMPF, 1)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), Units.gwei(1n))
  })

  it('should return "100" for two simple blocks with one 1559 tx', async () => {
    const blocksMPF = [[100n], [100n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 100n)
  })

  it('should return median for two transactions', async () => {
    const blocksMPF = [[100n, 200n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 150n)
  })

  it('should return median for three transactions', async () => {
    const blocksMPF = [[100n, 200n, 300n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 200n)
  })

  it('should apply linear regression - clear trend', async () => {
    const blocksMPF = [[100n], [200n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 300n)
  })

  it('should apply linear regression - mixed upwards trend (simple)', async () => {
    const blocksMPF = [[100n], [200n], [150n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 200n)
  })

  it('should apply linear regression - mixed upwards trend', async () => {
    const blocksMPF = [[300n], [200n], [250n], [400n], [700n], [200n]]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 457n)
  })

  it('should apply median + linear regression in more complex scenarios', async () => {
    const blocksMPF = [
      [300n, 10n],
      [200n, 20n],
      [250n, 30n],
      [400n, 40n, 100n],
      [700n],
      [200n, 10n],
    ]
    const { rpc } = await getSetup(blocksMPF)
    const res = await rpc.request(method, [])
    assert.strictEqual(hexToBigInt(res.result), 366n)
  })
})
