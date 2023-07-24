import { Block } from '@ethereumjs/block'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, expect, expectTypeOf, it } from 'vitest'

import genesisJSON from '../../testdata/geth-genesis/debug.json'
import {
  baseRequest,
  createClient,
  createManager,
  dummy,
  params,
  runBlockWithTxs,
  setupChain,
  startRPC,
} from '../helpers'

const method = 'debug_traceCall'

describe(method, () => {
  const manager = createManager(createClient({ opened: true }))
  const methods = manager.getMethods()
  const server = startRPC(methods)

  it(' debug_traceCall method exists', async () => {
    expect(Object.keys(methods)).toContain(method)
  })
  it(`expects param[0] to be type "object"`, async () => {
    const req = params(method, ['', ''])
    const expectRes = (res: any) => {
      expect(res.body.error.message).toBe('invalid argument 0: argument must be an object')
      return res
    }
    await baseRequest(server, req, 200, expectRes)
  })
  it(`expects param[1] to be type string`, async () => {
    const req = params(method, [{}, 0])
    const expectRes = (res: any) => {
      expect(res.body.error.message).toBe('invalid argument 1: argument must be a string')
      return res
    }
    await baseRequest(server, req, 200, expectRes)
  })
  it(`expects receiptManager`, async () => {
    const req = params(method, [{}, '0x0'])
    const expectRes = (res: any) => {
      expect(res.body.error.message).toBe('missing receiptsManager')
      return res
    }
    await baseRequest(server, req, 200, expectRes)
  })
})

describe('trace a call', async () => {
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

  it('call debug_traceCall with valid parameters', async () => {
    const rpcTxReq = params('eth_getTransactionByHash', [bytesToHex(tx.hash())])
    let rpcTx: any
    const expectResTx = async (res: any) => {
      const t = res.body.result

      rpcTx = {
        from: t.from,
        gas: t.gas,
        gasPrice: t.gasPrice,
        value: t.value,
        data: t.input,
        maxPriorityFeePerGas: t.maxPriorityFeePerGas,
        maxFeePerGas: t.maxFeePerGas,
        type: t.type,
      }
    }
    await baseRequest(server, rpcTxReq, 200, expectResTx, true)
    const req2 = params('debug_traceCall', [rpcTx, '0x1', {}])
    const expectRes2 = (res2: any) => {
      expectTypeOf(res2.body.result)
        .toHaveProperty('gas')
        .toHaveProperty('returnValue')
        .toHaveProperty('failed')
        .toHaveProperty('structLogs')

      assert.deepEqual(
        res2.body.result,
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
        'produced a correct trace'
      )
    }
    await baseRequest(server, req2, 200, expectRes2, true)
  })
})
