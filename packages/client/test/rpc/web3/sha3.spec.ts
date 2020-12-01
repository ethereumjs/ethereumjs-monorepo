import tape from 'tape'
import { baseSetup, params, baseRequest } from '../helpers'

const method = 'web3_sha3'

function compareErrorCode(t: any, error: any, errorCode: any) {
  const msg = `should return the correct error code (expected: ${errorCode}, received: ${error.code})`
  if (error.code !== errorCode) {
    throw new Error(msg)
  } else {
    t.pass(msg)
  }
}

function compareErrorMsg(t: any, error: any, errorMsg: any) {
  const msg = `should return "${errorMsg}" error message`
  if (error.message !== errorMsg) {
    throw new Error(msg)
  } else {
    t.pass(msg)
  }
}

tape(`${method}: call with one valid parameter`, (t) => {
  const server = baseSetup()

  const req = params(method, ['0x68656c6c6f20776f726c64'])
  const expectRes = (res: any) => {
    const { result } = res.body
    let msg = 'result string should not be empty'
    if (result.length === 0) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }

    msg = 'should return the correct hash value'
    if (result !== '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad') {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with one non-hex parameter`, (t) => {
  const server = baseSetup()

  const req = params(method, ['hello world'])
  const expectRes = (res: any) => {
    const { error } = res.body

    compareErrorCode(t, error, -32602)

    const errorMsg = 'invalid argument 0: hex string without 0x prefix'
    compareErrorMsg(t, error, errorMsg)
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with no parameters`, (t) => {
  const server = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { error } = res.body

    compareErrorCode(t, error, -32602)

    const errorMsg = 'missing value for required argument 0'
    compareErrorMsg(t, error, errorMsg)
  }
  baseRequest(t, server, req, 200, expectRes)
})
