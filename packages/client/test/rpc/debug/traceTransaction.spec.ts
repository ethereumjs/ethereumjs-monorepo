import { Block } from '@ethereumjs/block'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToPrefixedHexString } from '@ethereumjs/util'
import * as tape from 'tape'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/debug.json')
import { baseRequest, baseSetup, dummy, params, runBlockWithTxs, setupChain } from '../helpers'
import { checkError } from '../util'

const method = 'debug_traceTransaction'

tape(`${method}: call with invalid configuration`, async (t) => {
  const { server } = baseSetup({ engine: false, includeVM: true })

  const req = params(method, ['0xabcd', {}])
  const expectRes = checkError(t, INTERNAL_ERROR, 'missing receiptsManager')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid parameters`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge')

  let req = params(method, ['abcd', {}])
  let expectRes = checkError(t, INVALID_PARAMS, 'hex string without 0x prefix')
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { enableReturnData: true }])
  expectRes = checkError(t, INVALID_PARAMS, 'enabling return data not implemented')
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { tracerConfig: { some: 'value' } }])
  expectRes = checkError(
    t,
    INVALID_PARAMS,
    'custom tracers and tracer configurations are not implemented'
  )
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { tracer: 'someTracer' }])
  expectRes = checkError(t, INVALID_PARAMS, 'custom tracers not implemented')
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, ['0xabcd', { timeout: 1000 }])
  expectRes = checkError(t, INVALID_PARAMS, 'custom tracer timeouts not implemented')
  await baseRequest(t, server, req, 200, expectRes, false)
})

tape(`${method}: call with valid parameters`, async (t) => {
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
    t.equal(res.body.result.structLogs[0].op, 'PUSH1', 'produced a correct trace')
  }
  await baseRequest(t, server, req, 200, expectRes, true)
})

tape(`${method}: call with reverting code`, async (t) => {
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
    t.equal(res.body.result.failed, true, 'returns error result with reverting code')
  }
  await baseRequest(t, server, req, 200, expectRes, true)
})

tape(`${method}: call with memory enabled`, async (t) => {
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
    t.equal(
      res.body.result.structLogs[5].memory[0],
      '0x0000000000000000000000000000000000000000000000000000000000000042',
      'produced a trace with correct memory value returned'
    )
  }
  await baseRequest(t, server, req, 200, expectRes, true)
})

tape(`${method}: call with stack disabled`, async (t) => {
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
    t.ok(res.body.result.structLogs[1].stack === undefined, 'returns no stack with trace')
  }
  await baseRequest(t, server, req, 200, expectRes, true)
})
