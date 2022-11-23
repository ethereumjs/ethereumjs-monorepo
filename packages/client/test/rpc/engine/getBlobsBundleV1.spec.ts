import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/post-merge.json')
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

import { validPayload } from './forkchoiceUpdatedV1.spec'

const method = 'engine_getBlobsBundleV1'

tape(`${method}: call with invalid payloadId`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, [1])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: argument must be a hex string'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unknown payloadId`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, ['0x123'])
  const expectRes = checkError(t, -32001, 'Unknown payload')
  await baseRequest(t, server, req, 200, expectRes)
})

tape.only(`${method}: call with known payload`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  let req = params('engine_forkchoiceUpdatedV1', validPayload)
  let payloadId
  let expectRes = (res: any) => {
    payloadId = res.body.result.payloadId
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params('engine_getPayloadV1', [payloadId])
  expectRes = (res: any) => {
    t.equal(
      res.body.result.blockHash,
      '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
      'built expected block'
    )
  }

  await baseRequest(t, server, req, 200, expectRes, false)
  req = params(method, [payloadId])
  expectRes = (res: any) => {
    t.equal(
      res.body.result.blockHash,
      '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
      'got expected blockHash'
    )
  }
  await baseRequest(t, server, req, 200, expectRes, false)
})
