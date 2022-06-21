import * as tape from 'tape'
import Common, { Chain } from '@ethereumjs/common'
import { startRPC, createManager, createClient, baseSetup, params, baseRequest } from '../helpers'
import * as td from 'testdouble'
import { BlockHeader } from '@ethereumjs/block'

const method = 'net_version'

const originalValidate = BlockHeader.prototype._consensusFormatValidation

function compareResult(t: any, result: any, chainId: any) {
  let msg = 'result should be a string'
  t.equal(typeof result, 'string', msg)
  msg = 'result string should not be empty'
  t.notEqual(result.length, 0, msg)
  msg = `should be the correct chain ID (expected: ${chainId}, received: ${result})`
  t.equal(result, chainId, msg)
}

tape(`${method}: call on ropsten`, async (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Ropsten }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '3')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on mainnet`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '1')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on rinkeby`, async (t) => {
  // Stub out block consensusFormatValidation checks
  BlockHeader.prototype._consensusFormatValidation = td.func<any>()
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Rinkeby }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '4')
  }
  await baseRequest(t, server, req, 200, expectRes)
  td.reset()
})

tape(`${method}: call on kovan`, async (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Kovan }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '42')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on goerli`, async (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Goerli }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '5')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape('reset TD', (t) => {
  BlockHeader.prototype._consensusFormatValidation = originalValidate
  td.reset()
  t.end()
})
