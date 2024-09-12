import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.js'

const method = 'web3_sha3'

function compareErrorCode(error: any, errorCode: any) {
  assert.equal(
    error.code,
    errorCode,
    `should return the correct error code (expected: ${errorCode}, received: ${error.code})`,
  )
}

function compareErrorMsg(error: any, errorMsg: any) {
  assert.equal(error.message, errorMsg, `should return "${errorMsg}" error message`)
}

describe(method, () => {
  it('call with one valid parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['0x68656c6c6f20776f726c64'])
    const { result } = res
    assert.notEqual(result.length, 0, 'result string should not be empty')
    assert.equal(
      result,
      '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
      'should return the correct hash value',
    )
  })

  it('call with one non-hex parameter', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, ['hello world'])
    const { error } = res

    compareErrorCode(error, -32602)
    compareErrorMsg(error, 'invalid argument 0: hex string without 0x prefix')
  })

  it('call with no parameters', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])
    const { error } = res

    compareErrorCode(error, -32602)
    compareErrorMsg(error, 'missing value for required argument 0')
  })
})
