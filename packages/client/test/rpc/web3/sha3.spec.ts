import { assert, describe } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'web3_sha3'

function compareErrorCode(error: any, errorCode: any) {
  const msg = `should return the correct error code (expected: ${errorCode}, received: ${error.code})`
  assert.equal(error.code, errorCode, msg)
}

function compareErrorMsg(error: any, errorMsg: any) {
  const msg = `should return "${errorMsg}" error message`
  assert.equal(error.message, errorMsg, msg)
}

describe(`${method}: call with one valid parameter`, async () => {
  const { server } = baseSetup()

  const req = params(method, ['0x68656c6c6f20776f726c64'])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result string should not be empty'
    assert.notEqual(result.length, 0, msg)

    msg = 'should return the correct hash value'
    assert.equal(result, '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad', msg)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with one non-hex parameter`, async () => {
  const { server } = baseSetup()

  const req = params(method, ['hello world'])
  const expectRes = (res: any) => {
    const { error } = res.body

    compareErrorCode(error, -32602)

    const errorMsg = 'invalid argument 0: hex string without 0x prefix'
    compareErrorMsg(error, errorMsg)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with no parameters`, async () => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { error } = res.body

    compareErrorCode(error, -32602)

    const errorMsg = 'missing value for required argument 0'
    compareErrorMsg(error, errorMsg)
  }
  await baseRequest(server, req, 200, expectRes)
})
