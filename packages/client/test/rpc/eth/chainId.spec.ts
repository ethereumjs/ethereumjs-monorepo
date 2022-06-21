import * as tape from 'tape'
import Common, { Chain } from '@ethereumjs/common'
import { baseSetup, params, baseRequest, createClient, createManager, startRPC } from '../helpers'
import { BlockHeader } from '@ethereumjs/block'
import * as td from 'testdouble'

const method = 'eth_chainId'

const originalValidate = BlockHeader.prototype._consensusFormatValidation

tape(`${method}: calls`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'chainId should be a string'
    t.equal(typeof res.body.result, 'string', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: returns 1 for Mainnet`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return chainId 1'
    t.equal(res.body.result, '0x1', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: returns 3 for Ropsten`, async (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Ropsten }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return chainId 3'
    t.equal(res.body.result, '0x3', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: returns 42 for Kovan`, async (t) => {
  BlockHeader.prototype._consensusFormatValidation = td.func<any>()
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Kovan }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return chainId 42'
    const chainId = BigInt(42).toString(16)
    t.equal(res.body.result, `0x${chainId}`, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`reset TD`, (t) => {
  BlockHeader.prototype._consensusFormatValidation = originalValidate
  td.reset()
  t.end()
})
