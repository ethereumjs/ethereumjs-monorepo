import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { createBlob4844Tx, createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  bytesToHex,
  commitmentsToVersionedHashes,
  getBlobs,
  randomBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, describe, it } from 'vitest'

import { powData } from '../../testdata/geth-genesis/pow.ts'
import {
  dummy,
  getRPCClient,
  gethGenesisStartLondon,
  runBlockWithTxs,
  setupChain,
} from '../helpers.ts'

import type { PrefixedHexString } from '@ethereumjs/util'

const method = 'eth_getTransactionReceipt'
const kzg = new microEthKZG(trustedSetup)
describe(method, () => {
  it('call with legacy tx', async () => {
    const { chain, common, execution, server } = await setupChain(powData, 'pow')
    const rpc = getRPCClient(server)
    // construct tx
    const tx = createLegacyTx(
      {
        gasLimit: 2000000,
        gasPrice: 100,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.strictEqual(
      res.result.transactionHash,
      bytesToHex(tx.hash()),
      'should return the correct tx',
    )
  })

  it('call with 1559 tx', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(powData),
      'powLondon',
    )
    const rpc = getRPCClient(server)
    // construct tx
    const tx = createFeeMarket1559Tx(
      {
        gasLimit: 2000000,
        maxFeePerGas: 975000000,
        maxPriorityFeePerGas: 10,
        to: '0x1230000000000000000000000000000000000321',
      },
      { common },
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res = await rpc.request(method, [bytesToHex(tx.hash())])

    assert.strictEqual(
      res.result.transactionHash,
      bytesToHex(tx.hash()),
      'should return the correct tx',
    )
    assert.strictEqual(res.result.status, '0x1', 'transaction result is 1 since succeeded')
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

  it('get blobGasUsed/blobGasPrice in blob tx receipt', async () => {
    const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
    if (isBrowser() === true) {
      assert.isTrue(true)
    } else {
      const { eip4844GethGenesis } = await import('@ethereumjs/testdata')

      const common = createCommonFromGethGenesis(eip4844GethGenesis, {
        chain: 'customChain',
        hardfork: Hardfork.Cancun,
        customCrypto: {
          kzg,
        },
      })
      const { chain, execution, server } = await setupChain(eip4844GethGenesis, 'customChain', {
        customCrypto: { kzg },
      })
      common.setHardfork(Hardfork.Cancun)
      const rpc = getRPCClient(server)

      const blobs = getBlobs('hello world')
      const commitments = blobsToCommitments(kzg, blobs)
      const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
      const proofs = blobs.map((blob, ctx) =>
        kzg.computeBlobProof(blob, commitments[ctx]),
      ) as PrefixedHexString[]
      const tx = createBlob4844Tx(
        {
          blobVersionedHashes,
          blobs,
          kzgCommitments: commitments,
          kzgProofs: proofs,
          maxFeePerBlobGas: 1000000n,
          gasLimit: 0xffffn,
          maxFeePerGas: 10000000n,
          maxPriorityFeePerGas: 1000000n,
          to: randomBytes(20),
          nonce: 0n,
        },
        { common },
      ).sign(dummy.privKey)

      await runBlockWithTxs(chain, execution, [tx], true)

      const res = await rpc.request(method, [bytesToHex(tx.hash())])

      assert.strictEqual(res.result.blobGasUsed, '0x20000', 'receipt has correct blob gas usage')
      assert.strictEqual(res.result.blobGasPrice, '0x1', 'receipt has correct blob gas price')
    }
  })
})
