import { createBlock } from '@ethereumjs/block'
import { createTxFromTxData } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, expect, expectTypeOf, it } from 'vitest'

import { toRpcTx } from '../../../src/rpc/types.js'
import genesisJSON from '../../testdata/geth-genesis/debug.json'
import {
  createClient,
  createManager,
  dummy,
  getRpcClient,
  runBlockWithTxs,
  setupChain,
  startRPC,
} from '../helpers.js'

import type { RpcTx } from '../../../src/rpc/types.js'

const method = 'debug_traceCall'

describe(method, async () => {
  const manager = createManager(await createClient({ opened: true }))
  const methods = manager.getMethods()
  const server = startRPC(methods)
  const rpc = getRpcClient(server)

  it('debug_traceCall method exists', async () => {
    expect(Object.keys(methods)).toContain(method)
  })
  it(`expects param[0] to be type "object"`, async () => {
    const res = await rpc.request(method, ['', ''])

    expect(res.error.message).toBe('invalid argument 0: argument must be an object')
  })
  it(`expects param[1] to be type "string"`, async () => {
    const res = await rpc.request(method, [{}, 0])

    expect(res.error.message).toBe('invalid argument 1: argument must be a string')
  })
  it(`expects receiptManager`, async () => {
    const res = await rpc.request(method, [{}, '0x0'])

    expect(res.error.message).toBe('missing receiptsManager')
  })
})

describe('trace a call', async () => {
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

  it('call debug_traceCall with valid parameters', async () => {
    const rpcTxReq = await rpc.request('eth_getTransactionByHash', [bytesToHex(tx.hash())])
    let rpcTx: RpcTx = {}

    const t = rpcTxReq.result
    rpcTx = toRpcTx(t)

    const res2 = await rpc.request('debug_traceCall', [rpcTx, '0x1', {}])
    expectTypeOf(res2.result)
      .toHaveProperty('gas')
      .toHaveProperty('returnValue')
      .toHaveProperty('failed')
      .toHaveProperty('structLogs')

    assert.deepEqual(
      res2.result,
      {
        gas: '0x3',
        returnValue: '0x',
        failed: false,
        structLogs: [
          {
            pc: 0,
            op: 'PUSH1',
            gasCost: 6,
            gas: 1048575,
            depth: 0,
            error: null,
            stack: [],
            storage: {},
            memory: [],
          },
        ],
      },
      'produced a correct trace',
    )
  })
})
