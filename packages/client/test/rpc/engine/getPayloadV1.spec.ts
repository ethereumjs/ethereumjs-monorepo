import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { ExecutionPayload } from '@ethereumjs/block'

const method = 'engine_getPayloadV1'

const validForkChoiceState = {
  headBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  finalizedBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
}

const validPayloadAttributes = {
  timestamp: '0x5',
  prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
}
const validPayload = [validForkChoiceState, validPayloadAttributes]

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

    let payload: ExecutionPayload | undefined = undefined
    req = params(method, [payloadId])
    expectRes = (res: any) => {
      assert.equal(res.body.result.blockNumber, '0x1')
      payload = res.body.result
    }
    await baseRequest(server, req, 200, expectRes, false, false)

    // Without newpayload the fcU response should be syncing or accepted
    expectRes = (res: any) => {
      assert.equal(res.body.result.payloadStatus.status, 'SYNCING')
    }
    req = params('engine_forkchoiceUpdatedV1', [
      {
        ...validPayload[0],
        headBlockHash: '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
      },
    ])
    await baseRequest(server, req, 200, expectRes, false, false)

    // post new payload , the fcu should give valid
    expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
    }
    req = params('engine_newPayloadV1', [payload])
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
