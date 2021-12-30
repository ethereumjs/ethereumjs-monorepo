import tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common, { Chain } from '@ethereumjs/common'
import { baseSetup, params, baseRequest, createClient, createManager, startRPC } from '../helpers'

const method = 'eth_chainId'

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
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Kovan }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return chainId 42'
    const chainId = new BN(42).toString(16)
    t.equal(res.body.result, `0x${chainId}`, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
