import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup, setupChain } from '../helpers'
import { checkError } from '../util'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { validPayload } from './forkchoiceUpdatedV1.spec'

const method = 'engine_getPayloadV1'

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

tape(`${method}: call with known payload`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  const forkchoiceUpdateRequest = params('engine_forkchoiceUpdatedV1', validPayload)
  let payloadId
  const expectRes = (res: any) => {
    payloadId = res.body.result.payloadId
  }
  await baseRequest(t, server, forkchoiceUpdateRequest, 200, expectRes, false)

  const getPayloadRequest = params(method, [payloadId])

  const expectGetPayloadResponse = (res: any) => {
    t.equal(res.body.result.blockNumber, '0x1')
  }

  await baseRequest(t, server, getPayloadRequest, 200, expectGetPayloadResponse)
})
