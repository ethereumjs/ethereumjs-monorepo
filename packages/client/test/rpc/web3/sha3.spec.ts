import { assert, describe, it } from 'vitest'

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

describe(method, () => {
  it('call with one valid parameter', async () => {
    const { rpc } = baseSetup()

    const res = await rpc.request(method, ['0x68656c6c6f20776f726c64'])
    const { result } = res
    let msg = 'result string should not be empty'
    assert.notEqual(result.length, 0, msg)

    msg = 'should return the correct hash value'
    assert.equal(result, '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad', msg)
  })

  it('call with one non-hex parameter', async () => {
    const { rpc } = baseSetup()

    const res = await rpc.request(method, ['hello world'])
    const { error } = res

    compareErrorCode(error, -32602)

    const errorMsg = 'invalid argument 0: hex string without 0x prefix'
    compareErrorMsg(error, errorMsg)
  })

  it('call with no parameters', async () => {
    const { rpc } = baseSetup()

    const res = await rpc.request(method, [])
    const { error } = res

    compareErrorCode(error, -32602)

    const errorMsg = 'missing value for required argument 0'
    compareErrorMsg(error, errorMsg)
  })
})
