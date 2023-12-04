import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import pow from '../../testdata/geth-genesis/pow.json'
import {
  dummy,
  getRpcClient,
  gethGenesisStartLondon,
  runBlockWithTxs,
  setupChain,
} from '../helpers.js'

const method = 'eth_getTransactionByHash'

describe(method, () => {
  it('call with legacy tx', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow', { txLookupLimit: 1 })
    const rpc = getRpcClient(server)
    // construct tx
    const tx = LegacyTransaction.fromTxData(
      { gasLimit: 2000000, gasPrice: 100, to: '0x0000000000000000000000000000000000000000' },
      { common }
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    let res = await rpc.request(method, [bytesToHex(tx.hash())])
    let msg = 'should return the correct tx'
    assert.equal(res.result.hash, bytesToHex(tx.hash()), msg)

    // run a block to ensure tx hash index is cleaned up when txLookupLimit=1
    await runBlockWithTxs(chain, execution, [])
    res = await rpc.request(method, [bytesToHex(tx.hash())])

    msg = 'should return null when past txLookupLimit'
    assert.equal(res.result, null, msg)
  })

  it('call with 1559 tx', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(pow),
      'powLondon',
      { txLookupLimit: 0 }
    )
    const rpc = getRpcClient(server)
    // construct tx
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      {
        gasLimit: 2000000,
        maxFeePerGas: 975000000,
        maxPriorityFeePerGas: 10,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common }
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    let res = await rpc.request(method, [bytesToHex(tx.hash())])

    let msg = 'should return the correct tx type'
    assert.equal(res.result.type, '0x2', msg)

    // run some blocks to ensure tx hash index is not cleaned up when txLookupLimit=0
    await runBlockWithTxs(chain, execution, [])
    await runBlockWithTxs(chain, execution, [])
    await runBlockWithTxs(chain, execution, [])
    res = await rpc.request(method, [bytesToHex(tx.hash())])

    msg = 'should return the correct tx when txLookupLimit=0'
    assert.equal(res.result.hash, bytesToHex(tx.hash()), msg)
  })

  it('call with unknown tx hash', async () => {
    const { server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    // get a random tx hash
    const res = await rpc.request(method, [
      '0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0',
    ])

    const msg = 'should return null'
    assert.equal(res.result, null, msg)
  })
})
