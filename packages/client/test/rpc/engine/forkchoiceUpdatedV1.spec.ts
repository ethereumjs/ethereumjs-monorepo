import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup } from '../helpers'
import { checkError } from '../util'
import { parseCustomParams, parseGenesisState } from '../../../lib/util'
import Common from '@ethereumjs/common'
import Blockchain from '@ethereumjs/blockchain'

const method = 'engine_forkchoiceUpdatedV1'

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, [
    {
      headBlockHash: 'b084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      safeBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      finalizedBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
    },
    {
      payloadAttributes: null,
    },
  ])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'headBlockHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, [
    {
      headBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      safeBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      finalizedBlockHash: '0xinvalid',
    },
    {
      payloadAttributes: null,
    },
  ])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'finalizedBlockHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape.only(`${method}: call with valid data`, async (t) => {
  const genesis = require('../../testdata/post-merge.json')
  // const { client, server } = setupChain(genesis, 'post-merge', { engine: true })
  const genesisParams = await parseCustomParams(genesis, 'post-merge')
  const genesisState = await parseGenesisState(genesis)

  const common = new Common({
    chain: genesisParams.name,
    customChains: [[genesisParams, genesisState]],
  })
  const blockchain = await Blockchain.create({
    common,
  })
  const { server, client } = baseSetup({
    engine: true,
    includeVM: true,
    commonChain: common,
    blockchain,
  })

  await client.chain.open()
  await client.execution?.open()
  await client.chain.update()

  const payload = [
    {
      headBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
      safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
      finalizedBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      timestamp: '0x5',
      random: '0x0000000000000000000000000000000000000000000000000000000000000000',
      suggestedFeeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    },
  ]
  // const expectedPayloadId = '0xa247243752eb10b4'
  const req = params(method, payload)
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
    t.equal(res.body.result.payloadStatus.latestValidHash, null)
    t.equal(res.body.result.payloadStatus.validationError, null)
    // t.equal(res.body.result.payloadId, expectedPayloadId)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
