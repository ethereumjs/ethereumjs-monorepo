import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup } from '../helpers'
import { checkError } from '../util'

const method = 'engine_getPayload'

tape(`${method}: call with invalid payloadId`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [1])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: argument must be a hex string'
  )
  await baseRequest(t, server, req, 200, expectRes)
})
