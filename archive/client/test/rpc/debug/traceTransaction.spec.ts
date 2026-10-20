import { createBlock } from '@ethereumjs/block'
import { createTx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { debugData } from '@ethereumjs/testdata'
import { INTERNAL_ERROR, INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { baseSetup, dummy, getRPCClient, runBlockWithTxs, setupChain } from '../helpers.ts'

const method = 'debug_traceTransaction'

describe(method, () => {
  it('call with invalid configuration', async () => {
    const { rpc } = await baseSetup({ engine: false, includeVM: true })

    const res = await rpc.request(method, ['0xabcd', {}])
    assert.strictEqual(res.error.code, INTERNAL_ERROR)
    assert.isTrue(res.error.message.includes('missing receiptsManager'))
  })

  it('call with invalid parameters', async () => {
    const { server } = await setupChain(debugData, 'post-merge')
    const rpc = getRPCClient(server)
    let res = await rpc.request(method, ['abcd', {}])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('hex string without 0x prefix'))

    res = await rpc.request(method, ['0xabcd', { enableReturnData: true }])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('enabling return data not implemented'))

    res = await rpc.request(method, ['0xabcd', { tracerConfig: { some: 'value' } }])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(
      res.error.message.includes('custom tracers and tracer configurations are not implemented'),
    )

    res = await rpc.request(method, ['0xabcd', { tracer: 'someTracer' }])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('custom tracers not implemented'))

    res = await rpc.request(method, ['0xabcd', { timeout: 1000 }])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('custom tracer timeouts not implemented'))
  })

  it('call with valid parameters', async () => {
    const { chain, common, execution, server } = await setupChain(debugData, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRPCClient(server)
    // construct block with tx
    const tx = createTx(
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

    assert.strictEqual(res.result.structLogs[0].op, 'PUSH1', 'produced a correct trace')
  })

  it('call with reverting code', async () => {
    const { chain, common, execution, server } = await setupChain(debugData, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRPCClient(server)
    // construct block with tx
    const tx = createTx(
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

    assert.strictEqual(res.result.failed, true, 'returns error result with reverting code')
  })

  it('call with memory enabled', async () => {
    const { chain, common, execution, server } = await setupChain(debugData, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRPCClient(server)
    // construct block with tx
    const tx = createTx(
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

    assert.strictEqual(
      res.result.structLogs[5].memory[0],
      '0x0000000000000000000000000000000000000000000000000000000000000042',
      'produced a trace with correct memory value returned',
    )
  })

  it('call with stack disabled', async () => {
    const { chain, common, execution, server } = await setupChain(debugData, 'post-merge', {
      txLookupLimit: 0,
    })
    const rpc = getRPCClient(server)
    // construct block with tx
    const tx = createTx(
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
