import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'eth_getMaxPriorityFeePerGas'

function createChain() {
  const block = {
    transactions: [],
    hash: () => new Uint8Array([1]),
  }
  return {
    blocks: { latest: block },
    getBlock: () => block,
    getCanonicalHeadBlock: () => block,
    getBlocks: () => [block],
  }
}

describe(method, () => {
  it('calls', async () => {
    const client = await createClient({ chain: createChain() })
    const manager = createManager(client)
    const rpcServer = startRPC(manager.getMethods())
    const rpc = getRPCClient(rpcServer)

    client.config.synchronized = true

    const res = await rpc.request(method, [])
    console.log(res)
    assert.strictEqual(1, 1)
  })
})
