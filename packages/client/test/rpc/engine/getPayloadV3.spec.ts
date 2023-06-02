import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory } from '@ethereumjs/tx'
import {
  Account,
  Address,
  blobsToCommitments,
  blobsToProofs,
  bytesToPrefixedHexString,
  commitmentsToVersionedHashes,
  getBlobs,
  hexStringToBytes,
  initKZG,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/eip4844.json')
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

// Since the genesis is copy of withdrawals with just sharding hardfork also started
// at 0, we can re-use the same payload args
const validForkChoiceState = {
  headBlockHash: '0x860e60008cf149dcdb3dbd42f54bd23a5a5024a94b0cc85df1adbe0f528389f6',
  safeBlockHash: '0x860e60008cf149dcdb3dbd42f54bd23a5a5024a94b0cc85df1adbe0f528389f6',
  finalizedBlockHash: '0x860e60008cf149dcdb3dbd42f54bd23a5a5024a94b0cc85df1adbe0f528389f6',
}
const validPayloadAttributes = {
  timestamp: '0x2f',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xaa00000000000000000000000000000000000000',
}

const validPayload = [validForkChoiceState, { ...validPayloadAttributes, withdrawals: [] }]

initKZG(kzg, __dirname + '/../../../src/trustedSetups/devnet4.txt')
const method = 'engine_getPayloadV3'

tape(`${method}: call with invalid payloadId`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, [1])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: argument must be a hex string'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unknown payloadId`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, ['0x123'])
  const expectRes = checkError(t, -32001, 'Unknown payload')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with known payload`, async (t) => {
  // Disable stateroot validation in TxPool since valid state root isn't available
  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  const originalStateManagerCopy = DefaultStateManager.prototype.copy
  DefaultStateManager.prototype.setStateRoot = function (): any {}
  DefaultStateManager.prototype.copy = function () {
    return this
  }
  const { service, server, common } = await setupChain(genesisJSON, 'post-merge', {
    engine: true,
    hardfork: Hardfork.Cancun,
  })
  common.setHardfork(Hardfork.Cancun)
  const pkey = hexStringToBytes('9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355')
  const address = Address.fromPrivateKey(pkey)
  await service.execution.vm.stateManager.putAccount(address, new Account())
  const account = await service.execution.vm.stateManager.getAccount(address)

  account!.balance = 0xfffffffffffffffn
  await service.execution.vm.stateManager.putAccount(address, account!)
  let req = params('engine_forkchoiceUpdatedV2', validPayload)
  let payloadId
  let expectRes = (res: any) => {
    payloadId = res.body.result.payloadId
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  const txBlobs = getBlobs('hello world')
  const txCommitments = blobsToCommitments(txBlobs)
  const txVersionedHashes = commitmentsToVersionedHashes(txCommitments)
  const txProofs = blobsToProofs(txBlobs, txCommitments)

  const tx = TransactionFactory.fromTxData(
    {
      type: 0x03,
      versionedHashes: txVersionedHashes,
      blobs: txBlobs,
      kzgCommitments: txCommitments,
      kzgProofs: txProofs,
      maxFeePerDataGas: 1n,
      maxFeePerGas: 10000000000n,
      maxPriorityFeePerGas: 100000000n,
      gasLimit: 30000000n,
    },
    { common }
  ).sign(pkey)

  ;(service.txPool as any).vm._common.setHardfork(Hardfork.Cancun)
  await service.txPool.add(tx, true)
  req = params('engine_getPayloadV3', [payloadId])
  expectRes = (res: any) => {
    const { executionPayload, blobsBundle } = res.body.result
    t.equal(
      executionPayload.blockHash,
      '0xc51a3346df60c3b63c3e564b0f4b21eed69db6a64445b6a2e5a902185d05e796',
      'built expected block'
    )
    const { commitments, proofs, blobs } = blobsBundle
    t.ok(
      commitments.length === proofs.length && commitments.length === blobs.length,
      'equal commitments, proofs and blobs'
    )
    t.equal(blobs.length, 1, '1 blob should be returned')
    t.equal(proofs[0], bytesToPrefixedHexString(txProofs[0]), 'proof should match')
    t.equal(commitments[0], bytesToPrefixedHexString(txCommitments[0]), 'commitment should match')
    t.equal(blobs[0], bytesToPrefixedHexString(txBlobs[0]), 'blob should match')
  }

  await baseRequest(t, server, req, 200, expectRes, false)
  DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
  DefaultStateManager.prototype.copy = originalStateManagerCopy
})
