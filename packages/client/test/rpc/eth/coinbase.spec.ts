import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.js'

const method = 'eth_coinbase'

describe(method, () => {
  it('call', async () => {
    const coinbase: string = '0xebea8bff2be13d7e5e2b9d8809f7581e65fb0909'
    const { rpc } = await baseSetup({
      minerCoinbase: coinbase,
    })

    const res = await rpc.request(method, [])
    assert.equal(typeof res.result, 'string', 'coinbase address should be a string')
    assert.equal(res.result, coinbase, "coinbase address should be same as value it's been set to")
  })
})
