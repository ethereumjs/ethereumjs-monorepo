import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory, initKZG } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { TOO_LARGE_REQUEST } from '../../../lib/rpc/error-code'
import { baseRequest, baseSetup, params } from '../helpers'
import { checkError } from '../util'

const method = 'engine_getPayloadBodiesByHashV1'

tape(`${method}: call with too many hashes`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })
  const tooManyHashes: string[] = []
  for (let x = 0; x < 35; x++) {
    tooManyHashes.push('0x' + randomBytes(32).toString('hex'))
  }
  const req = params(method, [tooManyHashes])
  const expectRes = checkError(
    t,
    TOO_LARGE_REQUEST,
    'More than 32 execution payload bodies requested'
  )
  await baseRequest(t, server, req, 200, expectRes)
})
