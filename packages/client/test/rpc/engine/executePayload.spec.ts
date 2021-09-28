import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup } from '../helpers'
import { checkError } from '../util'

const method = 'engine_executePayload'

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['WRONG BLOCK NUMBER'])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0xWRONG BLOCK NUMBER'])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: invalid block hash')
  await baseRequest(t, server, req, 200, expectRes)
})
