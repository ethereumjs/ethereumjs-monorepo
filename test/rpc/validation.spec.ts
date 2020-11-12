import tape from 'tape'
import { startRPC } from './helpers'
import { middleware } from '../../lib/rpc/validation'
import { baseRequest } from './helpers'
import { checkError } from './util'
import { INVALID_PARAMS } from '../../lib/rpc/error-code'

const prefix = 'rpc/validation:'

tape(`${prefix} should work without \`params\` when it's optional`, (t) => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware(
      (params: any, cb: any) => {
        cb()
      },
      0,
      []
    ),
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1,
  }
  const expectRes = (res: any) => {
    t.equal(res.body.error, undefined, 'should not return an error object')
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${prefix} should return error without \`params\` when it's required`, (t) => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware(
      (params: any, cb: any) => {
        cb()
      },
      1,
      []
    ),
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1,
  }

  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')

  baseRequest(t, server, req, 200, expectRes)
})
