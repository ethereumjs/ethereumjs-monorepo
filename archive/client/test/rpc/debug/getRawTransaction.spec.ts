import { createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { powData } from '@ethereumjs/testdata'
import {
  dummy,
  getRPCClient,
  gethGenesisStartLondon,
  runBlockWithTxs,
  setupChain,
} from '../helpers.ts'

const method = 'debug_getRawTransaction'

describe(method, () => {
  it('call with legacy tx', async () => {
    const { chain, common, execution, server } = await setupChain(powData, 'pow', {
      txLookupLimit: 1,
    })
    const rpc = getRPCClient(server)
    // construct tx
    const tx = createLegacyTx(
      { gasLimit: 2000000, gasPrice: 100, to: '0x0000000000000000000000000000000000000000' },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res1 = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.strictEqual(res1.result, bytesToHex(tx.serialize()), 'should return the correct tx')

    // run a block to ensure tx hash index is cleaned up when txLookupLimit=1
    await runBlockWithTxs(chain, execution, [])
    const res2 = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.strictEqual(res2.result, null, 'should return null when past txLookupLimit')
  })

  it('call with 1559 tx', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
      {
        txLookupLimit: 0,
      },
    )
    const rpc = getRPCClient(server)
    // construct tx
    const tx = createFeeMarket1559Tx(
      {
        gasLimit: 2000000,
        maxFeePerGas: 975000000,
        maxPriorityFeePerGas: 10,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res1 = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.equal(res1.result, bytesToHex(tx.serialize()), 'should return the correct tx type')
    execution.txIndex = undefined
    const res2 = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.equal(res2.result, null, 'should return null when txIndex is undefined')
  })

  it('call with unknown tx hash', async () => {
    const { server } = await setupChain(powData, 'pow')
    const rpc = getRPCClient(server)
    // get a random tx hash
    const res = await rpc.request(method, [
      '0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0',
    ])
    assert.strictEqual(res.result, null, 'should return null')
  })
})
