import { BlockHeader } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import tape from 'tape'
import td from 'testdouble'

import { baseRequest, baseSetup, createClient, createManager, params, startRPC } from '../helpers'

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

tape(`${method}: call on mainnnet`, async (t) => {
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

tape(`${method}: call on mainnet`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '1')
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
