import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, baseSetup, params } from '../helpers'
import { checkError } from '../util'

const method = 'eth_getBlockByHash'

describe(method, () => {
  it('call with valid arguments', async () => {
    const { server } = baseSetup()

    const blockHash = '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
    let includeTransactions = false
    let req = params(method, [blockHash, includeTransactions])
    let expectRes = (res: any) => {
      assert.equal(res.body.result.number, '0x444444', 'should return the correct number')
      assert.equal(
        typeof res.body.result.transactions[0],
        'string',
        'should only include tx hashes'
      )
    }
    await baseRequest(server, req, 200, expectRes, false)

    includeTransactions = true
    req = params(method, [blockHash, includeTransactions])
    expectRes = (res: any) => {
      assert.equal(res.body.result.number, '0x444444', 'should return the correct number')
      assert.equal(typeof res.body.result.transactions[0], 'object', 'should include tx objects')
    }
    await baseRequest(server, req, 200, expectRes, true) // pass endOnFinish=true for last test
  })

  it('call with false for second argument', async () => {
    const { server } = baseSetup()

    const req = params(method, [
      '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
      false,
    ])
    const expectRes = (res: any) => {
      let msg = 'should return the correct number'
      assert.equal(res.body.result.number, '0x444444', msg)
      msg = 'should return only the hashes of the transactions'
      assert.equal(typeof res.body.result.transactions[0], 'string', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with invalid block hash without 0x', async () => {
    const { server } = baseSetup()

    const req = params(method, ['WRONG BLOCK NUMBER', true])
    const expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: hex string without 0x prefix')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with invalid hex string as block hash', async () => {
    const { server } = baseSetup()

    const req = params(method, ['0xWRONG BLOCK NUMBER', true])
    const expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: invalid block hash')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call without second parameter', async () => {
    const { server } = baseSetup()

    const req = params(method, ['0x0'])
    const expectRes = checkError(INVALID_PARAMS, 'missing value for required argument 1')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with invalid second parameter', async () => {
    const { server } = baseSetup()

    const req = params(method, ['0x0', 'INVALID PARAMETER'])
    const expectRes = checkError(INVALID_PARAMS)
    await baseRequest(server, req, 200, expectRes)
  })
})
