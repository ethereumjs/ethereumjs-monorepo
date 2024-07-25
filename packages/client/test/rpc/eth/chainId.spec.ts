import { Chain, Common } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { baseSetup, createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

const method = 'eth_chainId'

describe(method, () => {
  it('calls', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])
    assert.equal(typeof res.result, 'string', 'chainId should be a string')
  })

  it('returns 1 for Mainnet', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])

    assert.equal(res.result, '0x1', 'should return chainId 1')
  })

  it('returns 3 for Goerli', async () => {
    const manager = createManager(
      await createClient({ opened: true, commonChain: new Common({ chain: Chain.Goerli }) }),
    )
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    assert.equal(res.result, '0x5', 'should return chainId 5')
  })
})
