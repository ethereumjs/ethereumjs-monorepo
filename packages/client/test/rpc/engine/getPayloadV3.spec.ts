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
} from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import genesisJSON from '../../testdata/geth-genesis/eip4844.json'
import { baseSetup, getRpcClient, setupChain } from '../helpers.js'

// Since the genesis is copy of withdrawals with just sharding hardfork also started
// at 0, we can re-use the same payload args
const validForkChoiceState = {
  headBlockHash: '0xb5785cb83fccc2280113e494cad4f6659eb73977421a78588b6e251a0563d9da',
  safeBlockHash: '0xb5785cb83fccc2280113e494cad4f6659eb73977421a78588b6e251a0563d9da',
  finalizedBlockHash: '0xb5785cb83fccc2280113e494cad4f6659eb73977421a78588b6e251a0563d9da',
}
const validPayloadAttributes = {
  timestamp: '0x2f',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xaa00000000000000000000000000000000000000',
}

const validPayload = [
  validForkChoiceState,
  {
    ...validPayloadAttributes,
    withdrawals: [],
    parentBeaconBlockRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
  },
]

const method = 'engine_getPayloadV3'

describe(method, () => {
  it('call with invalid payloadId', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const res = await rpc.request(method, [1])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument 0: argument must be a hex string'))
  })

  it('call with unknown payloadId', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const res = await rpc.request(method, ['0x123'])
    assert.equal(res.error.code, -32001, 'Unknown payload')
  })

  it('call with known payload', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
    const originalStateManagerCopy = DefaultStateManager.prototype.shallowCopy
    DefaultStateManager.prototype.setStateRoot = function (): any {}
    DefaultStateManager.prototype.shallowCopy = function () {
      return this
    }

    const kzg = await loadKZG()

    const { service, server, common } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })

    const rpc = getRpcClient(server)
    common.setHardfork(Hardfork.Cancun)
    const pkey = hexToBytes('0x9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355')
    const address = Address.fromPrivateKey(pkey)
    await service.execution.vm.stateManager.putAccount(address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(address)

    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(address, account!)
    let res = await rpc.request('engine_forkchoiceUpdatedV3', validPayload)
    const payloadId = res.result.payloadId
    assert.ok(payloadId !== undefined && payloadId !== null, 'valid payloadId should be received')

    const txBlobs = getBlobs('hello world')
    const txCommitments = blobsToCommitments(kzg, txBlobs)
    const txVersionedHashes = commitmentsToVersionedHashes(txCommitments)
    const txProofs = blobsToProofs(kzg, txBlobs, txCommitments)

    const tx = TransactionFactory.fromTxData(
      {
        type: 0x03,
        blobVersionedHashes: txVersionedHashes,
        blobs: txBlobs,
        kzgCommitments: txCommitments,
        kzgProofs: txProofs,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: 10000000000n,
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
        to: Address.zero(),
      },
      { common }
    ).sign(pkey)

    await service.txPool.add(tx, true)
    res = await rpc.request('engine_getPayloadV3', [payloadId])

    const { executionPayload, blobsBundle } = res.result
    assert.equal(
      executionPayload.blockHash,
      '0x8c71ad199a3dda94de6a1c31cc50a26b1f03a8a4924e9ea3fd7420c6411cac42',
      'built expected block'
    )
    assert.equal(executionPayload.excessBlobGas, '0x0', 'correct execess blob gas')
    assert.equal(executionPayload.blobGasUsed, '0x20000', 'correct blob gas used')
    const { commitments, proofs, blobs } = blobsBundle
    assert.ok(
      commitments.length === proofs.length && commitments.length === blobs.length,
      'equal commitments, proofs and blobs'
    )
    assert.equal(blobs.length, 1, '1 blob should be returned')
    assert.equal(proofs[0], bytesToHex(txProofs[0]), 'proof should match')
    assert.equal(commitments[0], bytesToHex(txCommitments[0]), 'commitment should match')
    assert.equal(blobs[0], bytesToHex(txBlobs[0]), 'blob should match')

    DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
    DefaultStateManager.prototype.shallowCopy = originalStateManagerCopy
  })
})
