import { Common, Holesky } from '@ethereumjs/common'
import { goerliChainConfig } from '@ethereumjs/testdata'
import { assert, describe, it, vi } from 'vitest'

import { baseSetup, createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'net_version'

function compareResult(result: any, chainId: any) {
  assert.strictEqual(typeof result, 'string', 'result should be a string')
  assert.notEqual(result.length, 0, 'result string should not be empty')

  assert.strictEqual(
    result,
    chainId,
    `should be the correct chain ID (expected: ${chainId}, received: ${result})`,
  )
}

describe(method, () => {
  it('call on mainnet', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])

    const { result } = res
    compareResult(result, '1')
  })

  it('call on holesky', async () => {
    const manager = createManager(
      await createClient({ opened: true, commonChain: new Common({ chain: Holesky }) }),
    )
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])

    const { result } = res
    compareResult(result, '17000')

    vi.resetAllMocks()
  })

  it('call on goerli', async () => {
    const manager = createManager(
      await createClient({ opened: true, commonChain: new Common({ chain: goerliChainConfig }) }),
    )
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, [])
    const { result } = res
    compareResult(result, '5')
  })
})
