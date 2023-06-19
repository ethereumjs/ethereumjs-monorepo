import { BlockHeader } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { baseRequest, baseSetup, createClient, createManager, params, startRPC } from '../helpers'

const method = 'eth_chainId'

const originalValidate = BlockHeader.prototype._consensusFormatValidation

describe(method, () => {
  it('calls', async () => {
    const { server } = baseSetup()

    const req = params(method, [])
    const expectRes = (res: any) => {
      const msg = 'chainId should be a string'
      assert.equal(typeof res.body.result, 'string', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('returns 1 for Mainnet', async () => {
    const { server } = baseSetup()

    const req = params(method, [])
    const expectRes = (res: any) => {
      const msg = 'should return chainId 1'
      assert.equal(res.body.result, '0x1', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('returns 3 for Ropsten', async () => {
    const manager = createManager(
      createClient({ opened: true, commonChain: new Common({ chain: Chain.Ropsten }) })
    )
    const server = startRPC(manager.getMethods())

    const req = params(method, [])
    const expectRes = (res: any) => {
      const msg = 'should return chainId 3'
      assert.equal(res.body.result, '0x3', msg)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('reset TD', () => {
    BlockHeader.prototype._consensusFormatValidation = originalValidate
    td.reset()
  })
})
