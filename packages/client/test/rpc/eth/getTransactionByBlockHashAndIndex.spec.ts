import { LegacyTransaction } from '@ethereumjs/tx'
import { assert, describe } from 'vitest'

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

describe(`${method}: call with valid arguments`, async () => {
  const { server } = await setUp()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
  const mockTxHash = '0x13548b649129ad9beb57467a819d24b846fa0aa02a955f6e974541e1ebb8b02c'
  const mockTxIndex = '0x1'

  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = (res: any) => {
    assert.equal(res.body.result.hash, mockTxHash, 'should return the correct tx hash')
  }
  await baseRequest(server, req, 200, expectRes, false)
})

describe(`${method}: call with no argument`, async () => {
  const { server } = baseSetup()

  const req = params(method, [])
  const expectRes = checkError(INVALID_PARAMS, 'missing value for required argument 0')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with unknown block hash`, async () => {
  const { server } = await setupChain(pow, 'pow')

  const mockBlockHash = '0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0'
  const mockTxIndex = '0x1'

  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = checkError(INVALID_PARAMS, 'not found in DB')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid block hash`, async () => {
  const { server } = baseSetup()

  const mockBlockHash = 'INVALID_BLOCKHASH'
  const mockTxIndex = '0x1'

  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: hex string without 0x prefix')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call without tx hash`, async () => {
  const { server } = baseSetup()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'

  const req = params(method, [mockBlockHash])
  const expectRes = checkError(INVALID_PARAMS, 'missing value for required argument 1')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid tx hash`, async () => {
  const { server } = baseSetup()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
  const mockTxIndex = 'INVALIDA_TXINDEX'
  const req = params(method, [mockBlockHash, mockTxIndex])

  const expectRes = checkError(INVALID_PARAMS, 'invalid argument 1: hex string without 0x prefix')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with out-of-bound tx hash `, async () => {
  const { server } = baseSetup()

  const mockBlockHash = '0x572856aae9a653012a7df7aeb56bfb7fe77f5bcb4b69fd971c04e989f6ccf9b1'
  const mockTxIndex = '0x10'
  const req = params(method, [mockBlockHash, mockTxIndex])
  const expectRes = (res: any) => {
    assert.equal(res.body.result, null, 'should return null')
  }
  await baseRequest(server, req, 200, expectRes)
})
