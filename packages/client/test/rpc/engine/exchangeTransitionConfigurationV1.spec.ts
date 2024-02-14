import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_exchangeTransitionConfigurationV1'

const validConfig = {
  terminalTotalDifficulty: '0x0',
  terminalBlockHash: '0x1d93f244823f80efbd9292a0d0d72a2b03df8cd5a9688c6c3779d26a7cc5009c',
  terminalBlockNumber: '0x0',
}

const invalidConfig = {
  terminalTotalDifficulty: '0x100',
  terminalBlockHash: '0x1d93f244823f80efbd9292a0d0d72a2b03df8cd5a9688c6c3779d26a7cc5009c',
  terminalBlockNumber: '0x0',
}

describe(method, () => {
  it('call with valid config', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    const res = await rpc.request(method, [validConfig])
    assert.deepEqual(res.result, validConfig)
  })

  it('call with invalid config', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    const res = await rpc.request(method, [invalidConfig])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('terminalTotalDifficulty set to 0, received 256'))
  })
})
