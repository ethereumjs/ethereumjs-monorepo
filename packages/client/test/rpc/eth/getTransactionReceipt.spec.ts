import { BlockHeader } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
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
  baseSetup,
  dummy,
  gethGenesisStartLondon,
  params,
  runBlockWithTxs,
  setupChain,
} from '../helpers'

import pow = require('./../../testdata/geth-genesis/pow.json')

import type { FullEthereumService } from '../../../lib/service'

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
  // Disable stateroot validation in TxPool since valid state root isn't available
  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  DefaultStateManager.prototype.setStateRoot = (): any => {}
  const originalStateManagerCopy = DefaultStateManager.prototype.copy
  DefaultStateManager.prototype.copy = function () {
    return this
  }
  // Disable block header consensus format validation
  const consensusFormatValidation = BlockHeader.prototype._consensusFormatValidation
  BlockHeader.prototype._consensusFormatValidation = (): any => {}
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
  const pk = randomBytes(32)
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
  ).sign(pk)

  const vm = execution.vm
  const account = await vm.stateManager.getAccount(tx.getSenderAddress())
  account.balance = BigInt(0xfffffffffffff)
  await vm.stateManager.putAccount(tx.getSenderAddress(), account)

  await runBlockWithTxs(chain, execution, [tx], true)

  const req = params(method, ['0x' + tx.serializeNetworkWrapper().toString('hex')])
  const expectRes = (res: any) => {
    t.ok(res.body.result.dataGasUsed !== undefined)
  }

  await baseRequest(t, server, req, 200, expectRes)
  // Restore stubbed out functionality
  DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
  DefaultStateManager.prototype.copy = originalStateManagerCopy
  BlockHeader.prototype._consensusFormatValidation = consensusFormatValidation
})
