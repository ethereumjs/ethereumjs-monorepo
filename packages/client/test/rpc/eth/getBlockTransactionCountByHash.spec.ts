import { assert, describe } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, baseSetup, params } from '../helpers'
import { checkError } from '../util'

const method = 'eth_getBlockTransactionCountByHash'

describe(`${method}: call with valid arguments`, async () => {
  const { server } = baseSetup()

  const req = params(method, ['0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'])
  const expectRes = (res: any) => {
    const msg = 'transaction count should be 1'
    assert.equal(res.body.result, '0x1', msg)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid block hash without 0x`, async () => {
  const { server } = baseSetup()

  const req = params(method, ['WRONG BLOCK NUMBER'])
  const expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: hex string without 0x prefix')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid hex string as block hash`, async () => {
  const { server } = baseSetup()

  const req = params(method, ['0xWRONG BLOCK NUMBER', true])
  const expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: invalid block hash')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call without first parameter`, async () => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = checkError(INVALID_PARAMS, 'missing value for required argument 0')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid second parameter`, async () => {
  const { server } = baseSetup()

  const req = params(method, ['INVALID PARAMETER'])
  const expectRes = checkError(INVALID_PARAMS)
  await baseRequest(server, req, 200, expectRes)
})
