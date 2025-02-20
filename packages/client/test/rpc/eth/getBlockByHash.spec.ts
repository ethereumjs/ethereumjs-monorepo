import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { baseSetup } from '../helpers.js'

const method = 'eth_getBlockByHash'

describe(method, () => {
  it('call with valid arguments', async () => {
    const { rpc } = await baseSetup()

    const blockHash = '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
    let includeTransactions = false
    let res = await rpc.request(method, [blockHash, includeTransactions])
    assert.equal(res.result.number, '0x444444', 'should return the correct number')
    assert.equal(typeof res.result.transactions[0], 'string', 'should only include tx hashes')

    includeTransactions = true
    res = await rpc.request(method, [blockHash, includeTransactions])

    assert.equal(res.result.number, '0x444444', 'should return the correct number')
    assert.equal(typeof res.result.transactions[0], 'object', 'should include tx objects')
  })

  it('call with false for second argument', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [
      '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
      false,
    ])
    assert.equal(res.result.number, '0x444444', 'should return the correct number')
    assert.equal(
      typeof res.result.transactions[0],
      'string',
      'should return only the hashes of the transactions',
    )
  })

  it('call with invalid block hash without 0x', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['WRONG BLOCK NUMBER', true])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: hex string without 0x prefix'))
  })

  it('call with invalid hex string as block hash', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['0xWRONG BLOCK NUMBER', true])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: invalid block hash'))
  })

  it('call without second parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['0x0'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('missing value for required argument 1'))
  })

  it('call with invalid second parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['0x0', 'INVALID PARAMETER'])
    assert.equal(res.error.code, INVALID_PARAMS)
  })
})
