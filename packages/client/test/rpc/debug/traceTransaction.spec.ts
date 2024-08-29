import { createBlock } from '@ethereumjs/block'
import { createTxFromTxData } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import genesisJSON from '../../testdata/geth-genesis/debug.json'
import { baseSetup, dummy, getRpcClient, runBlockWithTxs, setupChain } from '../helpers.js'

const method = 'debug_traceTransaction'

describe(method, () => {
  it('call with invalid configuration', async () => {
    const { rpc } = await baseSetup({ engine: false, includeVM: true })

    const res = await rpc.request(method, ['0xabcd', {}])
    assert.equal(res.error.code, INTERNAL_ERROR)
    assert.ok(res.error.message.includes('missing receiptsManager'))
  })

  it('call with invalid parameters', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge')
    const rpc = getRpcClient(server)
    let res = await rpc.request(method, ['abcd', {}])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('hex string without 0x prefix'))

    res = await rpc.request(method, ['0xabcd', { enableReturnData: true }])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('enabling return data not implemented'))

    res = await rpc.request(method, ['0xabcd', { tracerConfig: { some: 'value' } }])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(
      res.error.message.includes('custom tracers and tracer configurations are not implemented'),
    )

    res = await rpc.request(method, ['0xabcd', { tracer: 'someTracer' }])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('custom tracers not implemented'))

    res = await rpc.request(method, ['0xabcd', { timeout: 1000 }])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('custom tracer timeouts not implemented'))
  })

  it('call with valid parameters', async () => {
    const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRpcClient(server)
    // construct block with tx
    const tx = createTxFromTxData(
      {
        type: 0x2,
        gasLimit: 0xfffff,
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 1,
        value: 10000,
        data: '0x60AA',
      },
      { common, freeze: false },
    ).sign(dummy.privKey)
    tx.getSenderAddress = () => {
      return dummy.addr
    }
    const block = createBlock({}, { common })
    block.transactions[0] = tx
    await runBlockWithTxs(chain, execution, [tx], true)

    const res = await rpc.request(method, [bytesToHex(tx.hash()), {}])

    assert.equal(res.result.structLogs[0].op, 'PUSH1', 'produced a correct trace')
  })

  it('call with reverting code', async () => {
    const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRpcClient(server)
    // construct block with tx
    const tx = createTxFromTxData(
      {
        type: 0x2,
        gasLimit: 0xfffff,
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 1,
        value: 10000,
        data: '0x560FAA',
      },
      { common, freeze: false },
    ).sign(dummy.privKey)
    tx.getSenderAddress = () => {
      return dummy.addr
    }
    const block = createBlock({}, { common })
    block.transactions[0] = tx
    await runBlockWithTxs(chain, execution, [tx], true)

    const res = await rpc.request(method, [bytesToHex(tx.hash()), {}])

    assert.equal(res.result.failed, true, 'returns error result with reverting code')
  })

  it('call with memory enabled', async () => {
    const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRpcClient(server)
    // construct block with tx
    const tx = createTxFromTxData(
      {
        type: 0x2,
        gasLimit: 0xfffff,
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 1,
        value: 10000,
        data: '0x604260005260206000F3',
      },
      { common, freeze: false },
    ).sign(dummy.privKey)
    tx.getSenderAddress = () => {
      return dummy.addr
    }
    const block = createBlock({}, { common })
    block.transactions[0] = tx
    await runBlockWithTxs(chain, execution, [tx], true)

    const res = await rpc.request(method, [bytesToHex(tx.hash()), { enableMemory: true }])

    assert.equal(
      res.result.structLogs[5].memory[0],
      '0x0000000000000000000000000000000000000000000000000000000000000042',
      'produced a trace with correct memory value returned',
    )
  })

  it('call with stack disabled', async () => {
    const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRpcClient(server)
    // construct block with tx
    const tx = createTxFromTxData(
      {
        type: 0x2,
        gasLimit: 0xfffff,
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 1,
        value: 10000,
        data: '0x600F6000',
      },
      { common, freeze: false },
    ).sign(dummy.privKey)
    tx.getSenderAddress = () => {
      return dummy.addr
    }
    const block = createBlock({}, { common })
    block.transactions[0] = tx
    await runBlockWithTxs(chain, execution, [tx], true)

    const res = await rpc.request(method, [bytesToHex(tx.hash()), { disableStack: true }])

    assert.isUndefined(res.result.structLogs[1].stack, 'returns no stack with trace')
  })
})
