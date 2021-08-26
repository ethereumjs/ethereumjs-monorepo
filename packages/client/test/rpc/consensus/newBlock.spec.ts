import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest } from '../helpers'
import { checkError } from '../util'

const method = 'consensus_newBlock'

tape(`${method}: call without parameter`, (t) => {
  const { server } = baseSetup()

  const req = params(method)
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')
  baseRequest(t, server, req, 200, expectRes)
})
