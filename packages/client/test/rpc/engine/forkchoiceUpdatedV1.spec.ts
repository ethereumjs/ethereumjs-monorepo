import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup, setupChain } from '../helpers'
import { checkError } from '../util'
import genesisJSON from '../../testdata/post-merge.json'

const method = 'engine_forkchoiceUpdatedV1'

const validForkChoiceState = {
  headBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  finalizedBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
}

const validPayloadAttributes = {
  timestamp: '0x5',
  random: '0x0000000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
}

const validPayload = [validForkChoiceState, validPayloadAttributes]

tape(`${method}: call with invalid head block hash without 0x`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })
  const invalidForkChoiceState = {
    ...validForkChoiceState,
    headBlockHash: 'unvalid formatted head block hash',
  }
  const req = params(method, [invalidForkChoiceState, validPayloadAttributes])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'headBlockHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const invalidForkChoiceState = {
    ...validForkChoiceState,
    finalizedBlockHash: '0xinvalid',
  }
  const req = params(method, [invalidForkChoiceState, validPayloadAttributes])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'finalizedBlockHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data but parent block is not loaded yet`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const nonExistentHeadBlockHash = {
    ...validForkChoiceState,
    headBlockHash: '0x1d93f244823f80efbd9292a0d0d72a2b03df8cd5a9688c6c3779d26a7cc5009c',
  }
  const req = params(method, [nonExistentHeadBlockHash, validPayloadAttributes])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'SYNCING')
    t.equal(res.body.result.payloadStatus.latestValidHash, validForkChoiceState.headBlockHash)
    t.equal(res.body.result.payloadStatus.validationError, null)
    t.equal(res.body.result.payloadId, null)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

// tape.only(
//   `${method}: call with valid data but head block hash is not stored in the chain`,
//   async (t) => {
//     const genesis = require('../../testdata/post-merge.json')
//     const { server, chain } = await setupChain(genesis, 'post-merge', { engine: true })
//
//     const header = BlockHeader.fromHeaderData()
//     const block = Block.fromBlockData({ header })
//     await chain.putBlocks([block], true)
//     const req = params(method, validPayload)
//     const expectRes = (res: any) => {
//       t.equal(res.body.result.payloadStatus.status, 'SYNCING')
//       t.equal(res.body.result.payloadStatus.latestValidHash, null)
//       t.equal(res.body.result.payloadStatus.validationError, null)
//       t.notEqual(res.body.result.payloadId, null)
//     }
//     await baseRequest(t, server, req, 200, expectRes)
//   }
// )

tape(`${method}: call with valid data and synced data`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const req = params(method, validPayload)
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
    t.equal(res.body.result.payloadStatus.latestValidHash, null)
    t.equal(res.body.result.payloadStatus.validationError, null)
    t.notEqual(res.body.result.payloadId, null)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
