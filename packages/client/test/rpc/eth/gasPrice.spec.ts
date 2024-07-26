import { create1559FeeMarketTx, createLegacyTx } from '@ethereumjs/tx'
import { bigIntToHex, intToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import pow from '../../testdata/geth-genesis/pow.json'
import {
  dummy,
  getRpcClient,
  gethGenesisStartLondon,
  runBlockWithTxs,
  setupChain,
} from '../helpers.js'

import type { LegacyTransaction } from '@ethereumjs/tx'

const method = 'eth_gasPrice'

describe(method, () => {
  it('call with legacy transaction data', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    const GAS_PRICE = 100
    // construct tx
    const tx = createLegacyTx(
      { gasLimit: 21000, gasPrice: GAS_PRICE, to: '0x0000000000000000000000000000000000000000' },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    const res = await rpc.request(method, [])
    assert.equal(
      res.result,
      intToHex(GAS_PRICE),
      'should return the correct suggested gas price with 1 legacy transaction',
    )
  })

  it('call with multiple legacy transactions', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    const iterations = BigInt(20)
    let averageGasPrice = BigInt(0)
    for (let i = 0; i < iterations; i++) {
      const gasPrice = i * 100
      averageGasPrice += BigInt(gasPrice)
      const tx = createLegacyTx(
        { nonce: i, gasLimit: 21000, gasPrice, to: '0x0000000000000000000000000000000000000000' },
        { common },
      ).sign(dummy.privKey)
      await runBlockWithTxs(chain, execution, [tx])
    }

    averageGasPrice = averageGasPrice / iterations
    const res = await rpc.request(method, [])
    assert.equal(
      res.result,
      bigIntToHex(averageGasPrice),
      'should return the correct gas price with multiple legacy transactions',
    )
  })

  it('call with multiple legacy transactions in a single block', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    const G1 = 100
    const G2 = 1231231

    const tx1 = createLegacyTx(
      { gasLimit: 21000, gasPrice: G1, to: '0x0000000000000000000000000000000000000000' },
      { common },
    ).sign(dummy.privKey)
    const tx2 = createLegacyTx(
      { nonce: 1, gasLimit: 21000, gasPrice: G2, to: '0x0000000000000000000000000000000000000000' },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx1, tx2])

    const averageGasPrice = (G1 + G2) / 2
    const res = await rpc.request(method, [])
    assert.equal(
      res.result,
      intToHex(Math.trunc(averageGasPrice)),
      'should return the correct gas price with multiple legacy transactions in a block',
    )
  })

  it('call with 1559 transaction data', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(pow),
      'powLondon',
    )
    const rpc = getRpcClient(server)
    const tx = create1559FeeMarketTx(
      {
        gasLimit: 21000,
        maxPriorityFeePerGas: 10,
        maxFeePerGas: 975000000,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])
    const res = await rpc.request(method, [])
    const latest = await chain.getCanonicalHeadHeader()
    const baseFee = latest.calcNextBaseFee()
    const gasPrice = BigInt(baseFee + tx.maxPriorityFeePerGas)
    assert.equal(
      res.result,
      bigIntToHex(gasPrice),
      'should return the correct gas price with 1 1559 transaction',
    )
  })

  it('call with multiple 1559 transactions', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(pow),
      'powLondon',
    )
    const rpc = getRpcClient(server)
    const maxPriority1 = 10
    const maxPriority2 = 1231231
    const tx1 = create1559FeeMarketTx(
      {
        gasLimit: 21000,
        maxPriorityFeePerGas: maxPriority1,
        maxFeePerGas: 975000000,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common },
    ).sign(dummy.privKey)
    const tx2 = create1559FeeMarketTx(
      {
        nonce: 1,
        gasLimit: 21000,
        maxPriorityFeePerGas: maxPriority2,
        maxFeePerGas: 975000000,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx1, tx2])
    const res = await rpc.request(method, [])
    const averagePriorityFee = BigInt(Math.trunc((maxPriority1 + maxPriority2) / 2))
    const latest = await chain.getCanonicalHeadHeader()
    const baseFee = latest.calcNextBaseFee()
    const gasPrice = BigInt(baseFee + averagePriorityFee)
    assert.equal(
      res.result,
      bigIntToHex(gasPrice),
      'should return the correct gas price with 1 1559 transaction',
    )
  })

  it('compute average gas price for 21 blocks', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    const iterations = BigInt(21)
    const gasPrice = BigInt(20)
    const firstBlockGasPrice = BigInt(11111111111111)
    let tx: LegacyTransaction
    for (let i = 0; i < iterations; i++) {
      if (i === 0) {
        tx = createLegacyTx(
          {
            nonce: i,
            gasLimit: 21000,
            gasPrice: firstBlockGasPrice,
            to: '0x0000000000000000000000000000000000000000',
          },
          { common },
        ).sign(dummy.privKey)
      } else {
        tx = createLegacyTx(
          {
            nonce: i,
            gasLimit: 21000,
            gasPrice,
            to: '0x0000000000000000000000000000000000000000',
          },
          { common },
        ).sign(dummy.privKey)
      }
      await runBlockWithTxs(chain, execution, [tx!])
    }

    const latest = await chain.getCanonicalHeadHeader()
    const blockNumber = latest.number

    // Should be block number 21
    assert.equal(blockNumber, 21n)

    const res = await rpc.request(method, [])
    assert.equal(
      res.result,
      bigIntToHex(gasPrice),
      'should return the correct gas price for 21 blocks',
    )
  })
})
