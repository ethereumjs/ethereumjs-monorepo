import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest } from '../helpers'
import { checkError } from '../util'

const method = 'engine_preparePayload'

const parentHash = '0x' + '0'.repeat(31) + '1' // 32 bytes
const timestamp = '0x' + '0'.repeat(7) + '1' // 8 bytes (64 bits)
const random = '0x' + '0'.repeat(31) + '1' // 32 bytes
const feeRecipient = '0x' + '0'.repeat(19) + '1' // 20 bytes

const preparePayloadParams = {
  parentHash,
  timestamp,
  random,
  feeRecipient,
}

tape(`${method}: call with invalid params`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [parentHash, timestamp, random, feeRecipient])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: argument is not object')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [{ ...preparePayloadParams, parentHash: parentHash.slice(2) }])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'parentHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [{ ...preparePayloadParams, parentHash: '0xinvalid' }])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'parentHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without a required parameter`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [{ ...preparePayloadParams, random: undefined }])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'parentHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with params from test vector`, async (t) => {
  const { server } = baseSetup()

  // from https://notes.ethereum.org/@9AeMAlpyQYaAAyuj47BzRw/rkwW3ceVY#Prepare-a-payload
  const testVector = {
    parentHash: '0xa0513a503d5bd6e89a144c3268e5b7e9da9dbf63df125a360e3950a7d0d67131',
    timestamp: '0x5',
    random: '0x0000000000000000000000000000000000000000000000000000000000000000',
    feeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
  }

  const req = params(method, [testVector])
  const expectRes = (res: any) => {
    const { result } = res.body
    if (result.payloadId === '0x0') {
      t.pass('returns payloadId')
    } else {
      throw new Error('invalid response')
    }
  }
  await baseRequest(t, server, req, 200, expectRes)
})
