import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { baseSetup } from '../helpers.ts'

const method = 'eth_getBlockTransactionCountByHash'

describe(method, () => {
  it('call with valid arguments', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [
      '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
    ])
    assert.strictEqual(res.result, '0x1', 'transaction count should be 1')
  }, 10000)

  it('call with invalid block hash without 0x', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['WRONG BLOCK NUMBER'])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('invalid argument 0: hex string without 0x prefix'))
  })

  it('call with invalid hex string as block hash', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['0xWRONG BLOCK NUMBER', true])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('invalid argument 0: invalid block hash'))
  })

  it('call without first parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('missing value for required argument 0'))
  })

  it('call with invalid second parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['INVALID PARAMETER'])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
  })
})
