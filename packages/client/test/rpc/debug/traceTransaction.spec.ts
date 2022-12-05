import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction, TransactionFactory } from '@ethereumjs/tx'
import { Address, bufferToHex } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { tracerOpts } from '../../../lib/rpc/modules'
import genesisJSON = require('../../testdata/geth-genesis/post-merge.json')
import { baseRequest, baseSetup, dummy, params, runBlockWithTxs, setupChain } from '../helpers'
import { checkError } from '../util'

import type { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

const method = 'debug_traceTransaction'

tape(`${method}: call with invalid configuration`, async (t) => {
  const { server } = baseSetup({ engine: false, includeVM: true })

  const req = params(method, ['0xabcd', []])
  const expectRes = checkError(t, INTERNAL_ERROR, 'missing receiptsManager')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid parameters`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge')

  let req = params(method, ['abcd', []])
  let expectRes = checkError(t, INVALID_PARAMS, 'hex string without 0x prefix')
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, ['0x' + randomBytes(32).toString('hex'), { disableStorage: false }])
  expectRes = checkError(t, INVALID_PARAMS, 'storage retrieval not implemented')
  await baseRequest(t, server, req, 200, expectRes)
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
  const req = params('debug_traceTransaction', [bufferToHex(tx.hash())])
  const expectRes = (res: any) => {
    console.log(res.body)
  }
  await baseRequest(t, server, req, 200, expectRes, true)
})
