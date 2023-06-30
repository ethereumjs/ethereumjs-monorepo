import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, baseSetup, params } from '../helpers'
import { checkError } from '../util'

const method = 'eth_getBlockByHash'

tape(`${method}: call with valid arguments`, async (t) => {
  const { server } = baseSetup()

  const blockHash = '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
  let includeTransactions = false
  let req = params(method, [blockHash, includeTransactions])
  let expectRes = (res: any) => {
    t.equal(res.body.result.number, '0x444444', 'should return the correct number')
    t.equal(typeof res.body.result.transactions[0], 'string', 'should only include tx hashes')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  includeTransactions = true
  req = params(method, [blockHash, includeTransactions])
  expectRes = (res: any) => {
    t.equal(res.body.result.number, '0x444444', 'should return the correct number')
    t.equal(typeof res.body.result.transactions[0], 'object', 'should include tx objects')
  }
  await baseRequest(t, server, req, 200, expectRes, true) // pass endOnFinish=true for last test
})

tape(`${method}: call with false for second argument`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [
    '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
    false,
  ])
  const expectRes = (res: any) => {
    let msg = 'should return the correct number'
    t.equal(res.body.result.number, '0x444444', msg)
    msg = 'should return only the hashes of the transactions'
    t.equal(typeof res.body.result.transactions[0], 'string', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['WRONG BLOCK NUMBER', true])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0xWRONG BLOCK NUMBER', true])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: invalid block hash')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without second parameter`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0x0'])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid second parameter`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0x0', 'INVALID PARAMETER'])
  const expectRes = checkError(t, INVALID_PARAMS)
  await baseRequest(t, server, req, 200, expectRes)
})
