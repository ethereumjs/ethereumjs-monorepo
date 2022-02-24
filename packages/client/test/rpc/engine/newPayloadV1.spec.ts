import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup, setupChain } from '../helpers'
import { checkError } from '../util'
import { validPayload } from './forkchoiceUpdatedV1.spec'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'

const method = 'engine_newPayloadV1'

const blockData = {
  parentHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  feeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
  stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  random: '0x0000000000000000000000000000000000000000000000000000000000000000',
  blockNumber: '0x1',
  gasLimit: '0x1c9c380',
  gasUsed: '0x0',
  timestamp: '0x5',
  extraData: '0x',
  baseFeePerGas: '0x7',
  blockHash: '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
  transactions: [],
}

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const blockDataWithInvalidParentHash = [
    {
      ...blockData,
      parentHash: blockData.parentHash.slice(2),
    },
  ]

  const req = params(method, blockDataWithInvalidParentHash)
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'parentHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const blockDataWithInvalidBlockHash = [{ ...blockData, blockHash: '0x-invalid-block-hash' }]
  const req = params(method, blockDataWithInvalidBlockHash)
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'blockHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'merge', { engine: true })

  const forkchoiceUpdateRequest = params('engine_forkchoiceUpdatedV1', validPayload)
  let payloadId
  const expectFcuRes = (res: any) => {
    payloadId = res.body.result.payloadId
  }
  await baseRequest(t, server, forkchoiceUpdateRequest, 200, expectFcuRes, false)

  const getPayloadRequest = params('engine_getPayloadV1', [payloadId])

  let data: any
  const expectGetPayloadResponse = (res: any) => {
    data = res.body.result
    t.equal(res.body.result.blockNumber, '0x1')
  }
  await baseRequest(t, server, getPayloadRequest, 200, expectGetPayloadResponse, false)

  const req = params(method, [data])
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'VALID')
    t.equal(res.body.result.latestValidHash, data.blockHash)
  }

  await baseRequest(t, server, req, 200, expectRes)
})
