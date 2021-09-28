import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest } from '../helpers'
import { checkError } from '../util'

const method = 'engine_consensusValidated'

tape(`${method}: call without parameter`, async (t) => {
  const { server } = baseSetup()

  const req = params(method)
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')
  await baseRequest(t, server, req, 200, expectRes)
})
