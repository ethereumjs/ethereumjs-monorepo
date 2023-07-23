import { describe, expect, it } from 'vitest'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

const method = 'debug_traceCall'

describe(method, () => {
  const manager = createManager(createClient({ opened: true }))
  const methods = manager.getMethods()
  const server = startRPC(methods)

  it(' debug_traceCall method exists', async () => {
    expect(Object.keys(methods)).toContain(method)
  })
  it(`expects param[0] to be type "object"`, async () => {
    const req = params(method, ['', ''])
    const expectRes = (res: any) => {
      expect(res._body.error.message).toBe('invalid argument 0: argument must be an object')
      return res
    }
    await baseRequest(server, req, 200, expectRes)
  })
  it(`expects param[1] to be type string`, async () => {
    const req = params(method, [{}, 0])
    const expectRes = (res: any) => {
      expect(res._body.error.message).toBe('invalid argument 1: argument must be a string')
      return res
    }
    await baseRequest(server, req, 200, expectRes)
  })
  it(`expects receiptManager`, async () => {
    const req = params(method, [{}, '0x0'])
    const expectRes = (res: any) => {
      expect(res._body.error.message).toBe('missing receiptsManager')
      return res
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
