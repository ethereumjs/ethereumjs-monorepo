import tape from 'tape'
import Common from '@ethereumjs/common'
import { startRPC, createManager, createClient, baseSetup, params, baseRequest } from '../helpers'

const method = 'net_version'

function compareResult(t: any, result: any, chainId: any) {
  let msg = 'result should be a string'
  if (typeof result !== 'string') {
    throw new Error(msg)
  } else {
    t.pass(msg)
  }

  msg = 'result string should not be empty'
  if (result.length === 0) {
    throw new Error(msg)
  } else {
    t.pass(msg)
  }

  msg = `should be the correct chain ID (expected: ${chainId}, received: ${result})`
  if (result !== chainId) {
    throw new Error(msg)
  } else {
    t.pass(msg)
  }
}

tape(`${method}: call on ropsten`, (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: 'ropsten' }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '3')
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on mainnet`, (t) => {
  const server = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '1')
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on rinkeby`, (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: 'rinkeby' }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '4')
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on kovan`, (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: 'kovan' }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '42')
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call on goerli`, (t) => {
  const manager = createManager(
    createClient({ opened: true, commonChain: new Common({ chain: 'goerli' }) })
  )
  const server = startRPC(manager.getMethods())

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    compareResult(t, result, '5')
  }
  baseRequest(t, server, req, 200, expectRes)
})
