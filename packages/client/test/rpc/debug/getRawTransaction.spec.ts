import { create1559FeeMarketTx, createLegacyTx } from '@ethereumjs/tx'
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

const method = 'debug_getRawTransaction'

describe(method, () => {
  it('call with legacy tx', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow', { txLookupLimit: 1 })
    const rpc = getRpcClient(server)
    // construct tx
    const tx = createLegacyTx(
      { gasLimit: 2000000, gasPrice: 100, to: '0x0000000000000000000000000000000000000000' },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res1 = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.equal(res1.result, bytesToHex(tx.serialize()), 'should return the correct tx')

    // run a block to ensure tx hash index is cleaned up when txLookupLimit=1
    await runBlockWithTxs(chain, execution, [])
    const res2 = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.equal(res2.result, null, 'should return null when past txLookupLimit')
  })

  it('call with 1559 tx', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(pow),
      'powLondon',
    )
    const rpc = getRpcClient(server)
    // construct tx
    const tx = create1559FeeMarketTx(
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
  })

  it('call with unknown tx hash', async () => {
    const { server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    // get a random tx hash
    const res = await rpc.request(method, [
      '0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0',
    ])
    assert.equal(res.result, null, 'should return null')
  })
})
