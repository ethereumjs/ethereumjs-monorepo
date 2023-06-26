import { LegacyTransaction } from '@ethereumjs/tx'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, baseSetup, dummy, params, runBlockWithTxs, setupChain } from '../helpers'
import { checkError } from '../util'

import pow = require('./../../testdata/geth-genesis/pow.json')

const method = 'eth_getTransactionByBlockHashAndIndex'

// build a server with 1 genesis block and one custom block containing 2 txs
async function setUp() {
  const { common, execution, server, chain } = await setupChain(pow, 'pow')
  const txs = [
    LegacyTransaction.fromTxData(
      {
        gasLimit: 21000,
        gasPrice: 100,
        nonce: 0,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common }
    ).sign(dummy.privKey),
    LegacyTransaction.fromTxData(
      { gasLimit: 21000, gasPrice: 50, nonce: 1, to: '0x0000000000000000000000000000000000000000' },
      { common }
    ).sign(dummy.privKey),
  ]

  await runBlockWithTxs(chain, execution, txs)

  return { server }
}

tape(`${method}: call with valid arguments`, async (t) => {
  const { server } = await setUp()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
  const mockTxHash = '0x13548b649129ad9beb57467a819d24b846fa0aa02a955f6e974541e1ebb8b02c'
  const mockTxIndex = '0x1'

  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = (res: any) => {
    t.equal(res.body.result.hash, mockTxHash, 'should return the correct tx hash')
  }
  await baseRequest(t, server, req, 200, expectRes, false)
})

tape(`${method}: call with no argument`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 0')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unknown block hash`, async (t) => {
  const { server } = await setupChain(pow, 'pow')

  const mockBlockHash = '0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0'
  const mockTxIndex = '0x1'

  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = checkError(t, INVALID_PARAMS, 'not found in DB')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block hash`, async (t) => {
  const { server } = baseSetup()

  const mockBlockHash = 'INVALID_BLOCKHASH'
  const mockTxIndex = '0x1'

  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without tx hash`, async (t) => {
  const { server } = baseSetup()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'

  const req = params(method, [mockBlockHash])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid tx hash`, async (t) => {
  const { server } = baseSetup()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
  const mockTxIndex = 'INVALIDA_TXINDEX'
  const req = params(method, [mockBlockHash, mockTxIndex])

  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 1: hex string without 0x prefix'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with out-of-bound tx hash `, async (t) => {
  const { server } = baseSetup()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
  const mockTxIndex = '0x10'
  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = (res: any) => {
    t.equal(res.body.result, null, 'should return null')
  }
  await baseRequest(t, server, req, 200, expectRes)
})
