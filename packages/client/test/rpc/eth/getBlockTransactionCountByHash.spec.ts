import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { baseSetup } from '../helpers.js'

const method = 'eth_getBlockTransactionCountByHash'

describe(method, () => {
  it('call with valid arguments', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [
      '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
    ])
    assert.equal(res.result, '0x1', 'transaction count should be 1')
  }, 10000)

  it('call with invalid block hash without 0x', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['WRONG BLOCK NUMBER'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: hex string without 0x prefix'))
  })

  it('call with invalid hex string as block hash', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['0xWRONG BLOCK NUMBER', true])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: invalid block hash'))
  })

  it('call without first parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('missing value for required argument 0'))
  })

  it('call with invalid second parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['INVALID PARAMETER'])
    assert.equal(res.error.code, INVALID_PARAMS)
  })
})
