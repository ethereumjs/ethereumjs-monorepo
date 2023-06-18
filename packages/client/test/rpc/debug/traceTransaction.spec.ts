import { Block } from '@ethereumjs/block'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToPrefixedHexString } from '@ethereumjs/util'
import { assert, describe } from 'vitest'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/debug.json')
import { baseRequest, baseSetup, dummy, params, runBlockWithTxs, setupChain } from '../helpers'
import { checkError } from '../util'

const method = 'debug_traceTransaction'

describe(`${method}: call with invalid configuration`, async () => {
  const { server } = baseSetup({ engine: false, includeVM: true })

  const req = params(method, ['0xabcd', {}])
  const expectRes = checkError(INTERNAL_ERROR, 'missing receiptsManager')
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: call with invalid parameters`, async () => {
  const { server } = await setupChain(genesisJSON, 'post-merge')

  let req = params(method, ['abcd', {}])
  let expectRes = checkError(INVALID_PARAMS, 'hex string without 0x prefix')
  await baseRequest(server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { enableReturnData: true }])
  expectRes = checkError(INVALID_PARAMS, 'enabling return data not implemented')
  await baseRequest(server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { tracerConfig: { some: 'value' } }])
  expectRes = checkError(
    INVALID_PARAMS,
    'custom tracers and tracer configurations are not implemented'
  )
  await baseRequest(server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { tracer: 'someTracer' }])
  expectRes = checkError(INVALID_PARAMS, 'custom tracers not implemented')
  await baseRequest(server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { timeout: 1000 }])
  expectRes = checkError(INVALID_PARAMS, 'custom tracer timeouts not implemented')
  await baseRequest(server, req, 200, expectRes, false)
})

describe(`${method}: call with valid parameters`, async () => {
  const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
    txLookupLimit: 0,
  })

  // construct block with tx
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x2,
      gasLimit: 0xfffff,
      maxFeePerGas: 10,
      maxPriorityFeePerGas: 1,
      value: 10000,
      data: '0x60AA',
    },
    { common, freeze: false }
  ).sign(dummy.privKey)
  tx.getSenderAddress = () => {
    return dummy.addr
  }
  const block = Block.fromBlockData({}, { common })
  block.transactions[0] = tx
  await runBlockWithTxs(chain, execution, [tx], true)

  const req = params(method, [bytesToPrefixedHexString(tx.hash()), {}])
  const expectRes = (res: any) => {
    assert.equal(res.body.result.structLogs[0].op, 'PUSH1', 'produced a correct trace')
  }
  await baseRequest(server, req, 200, expectRes, true)
})

describe(`${method}: call with reverting code`, async () => {
  const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
    txLookupLimit: 0,
  })

  // construct block with tx
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x2,
      gasLimit: 0xfffff,
      maxFeePerGas: 10,
      maxPriorityFeePerGas: 1,
      value: 10000,
      data: '0x560FAA',
    },
    { common, freeze: false }
  ).sign(dummy.privKey)
  tx.getSenderAddress = () => {
    return dummy.addr
  }
  const block = Block.fromBlockData({}, { common })
  block.transactions[0] = tx
  await runBlockWithTxs(chain, execution, [tx], true)

  const req = params(method, [bytesToPrefixedHexString(tx.hash()), {}])
  const expectRes = (res: any) => {
    assert.equal(res.body.result.failed, true, 'returns error result with reverting code')
  }
  await baseRequest(server, req, 200, expectRes, true)
})

describe(`${method}: call with memory enabled`, async () => {
  const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
    txLookupLimit: 0,
  })

  // construct block with tx
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x2,
      gasLimit: 0xfffff,
      maxFeePerGas: 10,
      maxPriorityFeePerGas: 1,
      value: 10000,
      data: '0x604260005260206000F3',
    },
    { common, freeze: false }
  ).sign(dummy.privKey)
  tx.getSenderAddress = () => {
    return dummy.addr
  }
  const block = Block.fromBlockData({}, { common })
  block.transactions[0] = tx
  await runBlockWithTxs(chain, execution, [tx], true)

  const req = params(method, [bytesToPrefixedHexString(tx.hash()), { enableMemory: true }])
  const expectRes = (res: any) => {
    assert.equal(
      res.body.result.structLogs[5].memory[0],
      '0x0000000000000000000000000000000000000000000000000000000000000042',
      'produced a trace with correct memory value returned'
    )
  }
  await baseRequest(server, req, 200, expectRes, true)
})

describe(`${method}: call with stack disabled`, async () => {
  const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
    txLookupLimit: 0,
  })

  // construct block with tx
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x2,
      gasLimit: 0xfffff,
      maxFeePerGas: 10,
      maxPriorityFeePerGas: 1,
      value: 10000,
      data: '0x600F6000',
    },
    { common, freeze: false }
  ).sign(dummy.privKey)
  tx.getSenderAddress = () => {
    return dummy.addr
  }
  const block = Block.fromBlockData({}, { common })
  block.transactions[0] = tx
  await runBlockWithTxs(chain, execution, [tx], true)

  const req = params(method, [bytesToPrefixedHexString(tx.hash()), { disableStack: true }])
  const expectRes = (res: any) => {
    assert.ok(res.body.result.structLogs[1].stack === undefined, 'returns no stack with trace')
  }
  await baseRequest(server, req, 200, expectRes, true)
})
