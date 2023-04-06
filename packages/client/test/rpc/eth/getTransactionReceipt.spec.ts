import { BlockHeader } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import {
  BlobEIP4844Transaction,
  FeeMarketEIP1559Transaction,
  Transaction,
  initKZG,
} from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
} from '@ethereumjs/tx/dist/utils/blobHelpers'
import { bufferToHex } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { randomBytes } from 'crypto'
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
  const req = params(method, [bufferToHex(tx.hash())])
  const expectRes = (res: any) => {
    const msg = 'should return the correct tx'
    t.equal(res.body.result.transactionHash, bufferToHex(tx.hash()), msg)
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
  const req = params(method, [bufferToHex(tx.hash())])
  const expectRes = (res: any) => {
    const msg = 'should return the correct tx'
    t.equal(res.body.result.transactionHash, bufferToHex(tx.hash()), msg)
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

tape(`${method}: get dataGasUsed in blob tx receipt`, async (t) => {
  try {
    kzg.freeTrustedSetup()
  } catch {
    // NOOP - just verifying KZG is ready if not already
  }
  initKZG(kzg, __dirname + '/../../../lib/trustedSetups/devnet4.txt')
  const gethGenesis = require('../../../../block/test/testdata/4844-hardfork.json')
  const common = Common.fromGethGenesis(gethGenesis, {
    chain: 'customChain',
    hardfork: Hardfork.ShardingForkDev,
  })
  const { chain, execution, server } = await setupChain(gethGenesis, 'customChain')
  common.setHardfork(Hardfork.ShardingForkDev)

  const blobs = getBlobs('hello world')
  const commitments = blobsToCommitments(blobs)
  const versionedHashes = commitmentsToVersionedHashes(commitments)
  const proof = kzg.computeAggregateKzgProof(blobs.map((blob) => Uint8Array.from(blob)))
  const bufferedHashes = versionedHashes.map((el) => Buffer.from(el))
  const tx = BlobEIP4844Transaction.fromTxData(
    {
      versionedHashes: bufferedHashes,
      blobs,
      kzgCommitments: commitments,
      kzgProof: proof,
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

  const req = params(method, ['0x' + tx.hash().toString('hex')])
  const expectRes = (res: any) => {
    t.equal(res.body.result.dataGasUsed, '0x20000', 'receipt has correct data gas usage')
  }

  await baseRequest(t, server, req, 200, expectRes)
})
