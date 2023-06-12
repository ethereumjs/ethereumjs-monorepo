import { Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction, FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  bytesToPrefixedHexString,
  commitmentsToVersionedHashes,
  getBlobs,
  initKZG,
  randomBytes,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import * as tape from 'tape'

import {
  baseRequest,
  dummy,
  gethGenesisStartLondon,
  params,
  runBlockWithTxs,
  setupChain,
} from '../helpers'

import pow = require('./../../testdata/geth-genesis/pow.json')

const method = 'eth_getTransactionReceipt'

tape(`${method}: call with legacy tx`, async (t) => {
  const { chain, common, execution, server } = await setupChain(pow, 'pow')

  // construct tx
  const tx = Transaction.fromTxData(
    {
      gasLimit: 2000000,
      gasPrice: 100,
      to: '0x0000000000000000000000000000000000000000',
    },
    { common }
  ).sign(dummy.privKey)

  await runBlockWithTxs(chain, execution, [tx])

  // get the tx
  const req = params(method, [bytesToPrefixedHexString(tx.hash())])
  const expectRes = (res: any) => {
    const msg = 'should return the correct tx'
    t.equal(res.body.result.transactionHash, bytesToPrefixedHexString(tx.hash()), msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with 1559 tx`, async (t) => {
  const { chain, common, execution, server } = await setupChain(
    gethGenesisStartLondon(pow),
    'powLondon'
  )

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
  const req = params(method, [bytesToPrefixedHexString(tx.hash())])
  const expectRes = (res: any) => {
    const msg = 'should return the correct tx'
    t.equal(res.body.result.transactionHash, bytesToPrefixedHexString(tx.hash()), msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unknown tx hash`, async (t) => {
  const { server } = await setupChain(pow, 'pow')

  // get a random tx hash
  const req = params(method, ['0x89ea5b54111befb936851660a72b686a21bc2fc4889a9a308196ff99d08925a0'])
  const expectRes = (res: any) => {
    const msg = 'should return null'
    t.equal(res.body.result, null, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: get dataGasUsed/dataGasPrice in blob tx receipt`, async (t) => {
  const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
  if (isBrowser() === true) {
    t.end()
  } else {
    try {
      // Verified KZG is loaded correctly -- NOOP if throws
      initKZG(kzg, __dirname + '/../../../src/trustedSetups/devnet6.txt')
      //eslint-disable-next-line
    } catch {}
    const gethGenesis = require('../../../../block/test/testdata/4844-hardfork.json')
    const common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
    })
    const { chain, execution, server } = await setupChain(gethGenesis, 'customChain')
    common.setHardfork(Hardfork.Cancun)

    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(blobs)
    const versionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobs.map((blob, ctx) => kzg.computeBlobKzgProof(blob, commitments[ctx]))
    const tx = BlobEIP4844Transaction.fromTxData(
      {
        versionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerDataGas: 1000000n,
        gasLimit: 0xffffn,
        maxFeePerGas: 10000000n,
        maxPriorityFeePerGas: 1000000n,
        to: randomBytes(20),
        nonce: 0n,
      },
      { common }
    ).sign(dummy.privKey)

    await runBlockWithTxs(chain, execution, [tx], true)

    const req = params(method, [bytesToPrefixedHexString(tx.hash())])
    const expectRes = (res: any) => {
      t.equal(res.body.result.dataGasUsed, '0x20000', 'receipt has correct data gas usage')
      t.equal(res.body.result.dataGasPrice, '0x1', 'receipt has correct data gas price')
    }

    await baseRequest(t, server, req, 200, expectRes)
  }
})
