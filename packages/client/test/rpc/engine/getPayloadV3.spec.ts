import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory } from '@ethereumjs/tx'
import {
  Account,
  Address,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  getBlobs,
  hexToBytes,
  initKZG,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON from '../../testdata/geth-genesis/eip4844.json'
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

// Since the genesis is copy of withdrawals with just sharding hardfork also started
// at 0, we can re-use the same payload args
const validForkChoiceState = {
  headBlockHash: '0x771d2330f20db47cef611364dc643ab75e1e99159fe37dc86942ab03c6a6344b',
  safeBlockHash: '0x771d2330f20db47cef611364dc643ab75e1e99159fe37dc86942ab03c6a6344b',
  finalizedBlockHash: '0x771d2330f20db47cef611364dc643ab75e1e99159fe37dc86942ab03c6a6344b',
}
const validPayloadAttributes = {
  timestamp: '0x2f',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xaa00000000000000000000000000000000000000',
}

const validPayload = [validForkChoiceState, { ...validPayloadAttributes, withdrawals: [] }]

try {
  initKZG(kzg, __dirname + '/../../../src/trustedSetups/devnet6.txt')
  // eslint-disable-next-line
} catch {}
const method = 'engine_getPayloadV3'

describe(method, () => {
  it('call with invalid payloadId', async () => {
    const { server } = baseSetup({ engine: true, includeVM: true })

    const req = params(method, [1])
    const expectRes = checkError(
      INVALID_PARAMS,
      'invalid argument 0: argument must be a hex string'
    )
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with unknown payloadId', async () => {
    const { server } = baseSetup({ engine: true, includeVM: true })

    const req = params(method, ['0x123'])
    const expectRes = checkError(-32001, 'Unknown payload')
    await baseRequest(server, req, 200, expectRes)
  })

  it('call with known payload', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
    const originalStateManagerCopy = DefaultStateManager.prototype.shallowCopy
    DefaultStateManager.prototype.setStateRoot = function (): any {}
    DefaultStateManager.prototype.shallowCopy = function () {
      return this
    }
    const { service, server, common } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
    })
    common.setHardfork(Hardfork.Cancun)
    const pkey = hexToBytes('0x9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355')
    const address = Address.fromPrivateKey(pkey)
    await service.execution.vm.stateManager.putAccount(address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(address)

    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(address, account!)
    let req = params('engine_forkchoiceUpdatedV2', validPayload)
    let payloadId
    let expectRes = (res: any) => {
      payloadId = res.body.result.payloadId
      assert.ok(payloadId !== undefined && payloadId !== null, 'valid payloadId should be received')
    }
    await baseRequest(server, req, 200, expectRes, false)

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
      assert.equal(
        executionPayload.blockHash,
        '0x9db3128f029d4043d32786a8896fbaadac4c07ec475213a43534ec06079f08b1',
        'built expected block'
      )
      assert.equal(executionPayload.excessDataGas, '0x0', 'correct execess data gas')
      assert.equal(executionPayload.dataGasUsed, '0x20000', 'correct data gas used')
      const { commitments, proofs, blobs } = blobsBundle
      assert.ok(
        commitments.length === proofs.length && commitments.length === blobs.length,
        'equal commitments, proofs and blobs'
      )
      assert.equal(blobs.length, 1, '1 blob should be returned')
      assert.equal(proofs[0], bytesToHex(txProofs[0]), 'proof should match')
      assert.equal(commitments[0], bytesToHex(txCommitments[0]), 'commitment should match')
      assert.equal(blobs[0], bytesToHex(txBlobs[0]), 'blob should match')
    }

    await baseRequest(server, req, 200, expectRes, false)
    DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
    DefaultStateManager.prototype.shallowCopy = originalStateManagerCopy
  })
})
