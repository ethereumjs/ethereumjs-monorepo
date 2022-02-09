import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest } from '../helpers'
import { checkError } from '../util'

const method = 'engine_consensusValidated'

tape(`${method}: call without parameter`, async (t) => {
  const { server } = baseSetup({ engine: true })

  const req = params(method)
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid status value`, async (t) => {
  const { server } = baseSetup({ engine: true })

  const req = params(method, [
    {
      blockHash: '0x1b8d9c5bcdf9f15393f94277c7a80f5d3662a7b8e1c667cde8609bf9f85f3fcf',
      status: 'RED',
    },
  ])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    `invalid argument 0 for key 'status': argument is not one of ["VALID", "INVALID"]`
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unknown header`, async (t) => {
  const { server } = baseSetup({ engine: true })

  const req = params(method, [
    {
      blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      status: 'VALID',
    },
  ])
  const expectRes = checkError(t, 4, 'Unknown header')
  await baseRequest(t, server, req, 200, expectRes)
})
