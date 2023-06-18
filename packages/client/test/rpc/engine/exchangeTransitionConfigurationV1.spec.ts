import { assert, describe } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/post-merge.json')
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

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

describe(`${method}: call with valid config`, async () => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const req = params(method, [validConfig])
  const expectRes = (res: any) => {
    assert.deepEqual(res.body.result, validConfig)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid config`, async () => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const req = params(method, [invalidConfig])
  const expectRes = checkError(INVALID_PARAMS, 'terminalTotalDifficulty set to 0, received 256')
  await baseRequest(server, req, 200, expectRes)
})
