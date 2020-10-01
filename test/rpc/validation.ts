// Suppresses "Cannot redeclare block-scoped variable" errors
// TODO: remove when import becomes possible
export = {}

import * as test from 'tape'

const { startRPC } = require('./helpers')
const { middleware } = require('../../lib/rpc/validation')
const { baseRequest } = require('./helpers')
const { checkError } = require('./util')
const { INVALID_PARAMS } = require('../../lib/rpc/error-code')

const prefix = 'rpc/validation:'

test(`${prefix} should work without \`params\` when it's optional`, t => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware((params: any, cb: any) => {
      cb()
    }, 0, [])
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1
  }
  const expectRes = (res: any) => {
    t.equal(res.body.error, undefined, 'should not return an error object')
  }
  baseRequest(t, server, req, 200, expectRes)
})

test(`${prefix} should return error without \`params\` when it's required`, t => {
  const mockMethodName = 'mock'
  const server = startRPC({
    [mockMethodName]: middleware((params: any, cb: any) => {
      cb()
    }, 1, [])
  })

  const req = {
    jsonrpc: '2.0',
    method: mockMethodName,
    id: 1
  }

  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'missing value for required argument 0'
  )

  baseRequest(t, server, req, 200, expectRes)
})
