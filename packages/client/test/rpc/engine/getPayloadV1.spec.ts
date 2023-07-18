import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

import { validPayload } from './forkchoiceUpdatedV1.spec'

const method = 'engine_getPayloadV1'

describe(method, () => {
  it('call with invalid payloadId', async () => {
    const { server } = baseSetup({ engine: true, includeVM: true })

    const req = params(method, [1])
    const expectRes = checkError(
      INVALID_PARAMS,
      'invalid argument 0: argument must be a hex string'
    )
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with unknown payloadId', async () => {
    const { server } = baseSetup({ engine: true, includeVM: true })

    const req = params(method, ['0x123'])
    const expectRes = checkError(-32001, 'Unknown payload')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with known payload', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    let req = params('engine_forkchoiceUpdatedV1', validPayload)
    let payloadId
    let expectRes = (res: any) => {
      payloadId = res.body.result.payloadId
    }
    await baseRequest(server, req, 200, expectRes, false, false)

    req = params(method, [payloadId])
    expectRes = (res: any) => {
      assert.equal(res.body.result.blockNumber, '0x1')
    }
    await baseRequest(server, req, 200, expectRes, false, false)

    expectRes = (res: any) => {
      assert.equal(res.body.result.payloadStatus.status, 'VALID')
    }
    req = params('engine_forkchoiceUpdatedV1', [
      {
        ...validPayload[0],
        headBlockHash: '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
      },
    ])
    await baseRequest(server, req, 200, expectRes)
  })
})
