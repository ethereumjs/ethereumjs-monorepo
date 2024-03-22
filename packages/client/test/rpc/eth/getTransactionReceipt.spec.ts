import { Common, Hardfork } from '@ethereumjs/common'
import {
  BlobEIP4844Transaction,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
} from '@ethereumjs/tx'
import {
  blobsToCommitments,
  bytesToHex,
  commitmentsToVersionedHashes,
  getBlobs,
  randomBytes,
} from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import pow from '../../testdata/geth-genesis/pow.json'
import {
  dummy,
  getRpcClient,
  gethGenesisStartLondon,
  runBlockWithTxs,
  setupChain,
} from '../helpers.js'

const method = 'eth_getTransactionReceipt'

describe(method, () => {
  it('call with legacy tx', async () => {
    const { chain, common, execution, server } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    // construct tx
    const tx = LegacyTransaction.fromTxData(
      {
        gasLimit: 2000000,
        gasPrice: 100,
        to: '0x0000000000000000000000000000000000000000',
      },
      { common }
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res = await rpc.request(method, [bytesToHex(tx.hash())])
    assert.equal(res.result.transactionHash, bytesToHex(tx.hash()), 'should return the correct tx')
  })

  it('call with 1559 tx', async () => {
    const { chain, common, execution, server } = await setupChain(
      gethGenesisStartLondon(pow),
      'powLondon'
    )
    const rpc = getRpcClient(server)
    // construct tx
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      {
        gasLimit: 2000000,
        maxFeePerGas: 975000000,
        maxPriorityFeePerGas: 10,
        to: '0x1230000000000000000000000000000000000321',
      },
      { common }
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx])

    // get the tx
    const res = await rpc.request(method, [bytesToHex(tx.hash())])

    assert.equal(res.result.transactionHash, bytesToHex(tx.hash()), 'should return the correct tx')
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

  it('get blobGasUsed/blobGasPrice in blob tx receipt', async () => {
    const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
    if (isBrowser() === true) {
      assert.ok(true)
    } else {
      const gethGenesis = require('../../../../block/test/testdata/4844-hardfork.json')

      const kzg = await loadKZG()

      const common = Common.fromGethGenesis(gethGenesis, {
        chain: 'customChain',
        hardfork: Hardfork.Cancun,
        customCrypto: {
          kzg,
        },
      })
      const { chain, execution, server } = await setupChain(gethGenesis, 'customChain', {
        customCrypto: { kzg },
      })
      common.setHardfork(Hardfork.Cancun)
      const rpc = getRpcClient(server)

      const blobs = getBlobs('hello world')
      const commitments = blobsToCommitments(kzg, blobs)
      const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
      const proofs = blobs.map((blob, ctx) => kzg.computeBlobKzgProof(blob, commitments[ctx]))
      const tx = BlobEIP4844Transaction.fromTxData(
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
        { common }
      ).sign(dummy.privKey)

      await runBlockWithTxs(chain, execution, [tx], true)

      const res = await rpc.request(method, [bytesToHex(tx.hash())])

      assert.equal(res.result.blobGasUsed, '0x20000', 'receipt has correct blob gas usage')
      assert.equal(res.result.blobGasPrice, '0x1', 'receipt has correct blob gas price')
    }
  })
})
