import { BlockHeader } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import { assert, describe, it, vi } from 'vitest'

import {
  baseSetup,
  createClient,
  createManager,
  getRpcClient,
  params,
  startRPC,
} from '../helpers.js'

const method = 'net_version'

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

function compareResult(result: any, chainId: any) {
  let msg = 'result should be a string'
  assert.equal(typeof result, 'string', msg)
  msg = 'result string should not be empty'
  assert.notEqual(result.length, 0, msg)
  msg = `should be the correct chain ID (expected: ${chainId}, received: ${result})`
  assert.equal(result, chainId, msg)
}

describe(method, () => {
  it('call on mainnet', async () => {
    const { rpc } = baseSetup()

    const res = await rpc.request(method, [])

    const { result } = res
    compareResult(result, '1')
  })

  it('call on sepolia', async () => {
    // Stub out block consensusFormatValidation checks
    BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()
    const manager = createManager(
      createClient({ opened: true, commonChain: new Common({ chain: Chain.Sepolia }) })
    )
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    const { result } = res
    compareResult(result, '11155111')

    vi.resetAllMocks()
  })

  it('call on goerli', async () => {
    const manager = createManager(
      createClient({ opened: true, commonChain: new Common({ chain: Chain.Goerli }) })
    )
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    compareResult(result, '5')
  })
})
