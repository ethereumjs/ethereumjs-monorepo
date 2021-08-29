import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest } from '../helpers'
import { checkError } from '../util'

const method = 'consensus_assembleBlock'

tape(`${method}: call with invalid block hash without 0x`, (t) => {
  const { server } = baseSetup()

  const req = params(method, ['WRONG BLOCK NUMBER', 10000])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0xWRONG BLOCK NUMBER', 10000])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: invalid block hash')
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without second parameter`, (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0x0'])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  baseRequest(t, server, req, 200, expectRes)
})
