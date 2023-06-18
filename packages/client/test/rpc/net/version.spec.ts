import { BlockHeader } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import * as td from 'testdouble'
import { assert, describe } from 'vitest'

import { baseRequest, baseSetup, createClient, createManager, params, startRPC } from '../helpers'

const method = 'net_version'

const originalValidate = BlockHeader.prototype._consensusFormatValidation

function compareResult(result: any, chainId: any) {
  let msg = 'result should be a string'
  assert.equal(typeof result, 'string', msg)
  msg = 'result string should not be empty'
  assert.notEqual(result.length, 0, msg)
  msg = `should be the correct chain ID (expected: ${chainId}, received: ${result})`
  assert.equal(result, chainId, msg)
}

describe(`${method}: call on ropsten`, async () => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Ropsten }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(result, '3')
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call on mainnet`, async () => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(result, '1')
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call on rinkeby`, async () => {
  // Stub out block consensusFormatValidation checks
  BlockHeader.prototype._consensusFormatValidation = td.func<any>()
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Rinkeby }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(result, '4')
  }
  await baseRequest(server, req, 200, expectRes)
  td.reset()
})

describe(`${method}: call on goerli`, async () => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: Chain.Goerli }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(result, '5')
  }
  await baseRequest(server, req, 200, expectRes)
})

describe('reset TD', () => {
  BlockHeader.prototype._consensusFormatValidation = originalValidate
  td.reset()
})
