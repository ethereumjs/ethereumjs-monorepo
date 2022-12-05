import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { tracerOpts } from '../../../lib/rpc/modules'
import blocks = require('../../testdata/blocks/beacon.json')
import genesisJSON = require('../../testdata/geth-genesis/post-merge.json')
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

const method = 'debug_traceTransaction'

tape(`${method}: call with invalid parameters`, async (t) => {
  const { server } = baseSetup({ engine: false, includeVM: true })

  const req = params(method, ['abcd', []])
  const expectRes = checkError(t, INVALID_PARAMS, 'hex string without 0x prefix')
  await baseRequest(t, server, req, 200, expectRes, true)
})
