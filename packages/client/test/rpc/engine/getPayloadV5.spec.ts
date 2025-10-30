import { Hardfork } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { SIGNER_H, osakaGethGenesis } from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
import {
  Account,
  CELLS_PER_EXT_BLOB,
  Units,
  blobsToCellsAndProofs,
  blobsToCommitments,
  blobsToProofs,
  commitmentsToVersionedHashes,
  createZeroAddress,
  getBlobs,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { getCryptoFunctions } from '../../../bin/utils.ts'
import { getRPCClient, setupChain } from '../helpers.ts'

// Since the genesis is copy of withdrawals with just sharding hardfork also started
// at 0, we can re-use the same payload args
const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'
const validForkChoiceState = {
  headBlockHash: '0xa85d6596cb45ab895555e76857c45440a6cf74b1895fb6f560dacf45b7db782b',
  safeBlockHash: '0xa85d6596cb45ab895555e76857c45440a6cf74b1895fb6f560dacf45b7db782b',
  finalizedBlockHash: '0xa85d6596cb45ab895555e76857c45440a6cf74b1895fb6f560dacf45b7db782b',
}
const validPayloadAttributes = {
  timestamp: '0x64ba84fd',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xaa00000000000000000000000000000000000000',
}

const validPayload = [
  validForkChoiceState,
  {
    ...validPayloadAttributes,
    withdrawals: [],
    parentBeaconBlockRoot,
  },
]

const method = 'engine_getPayloadV5'

describe(method, () => {
  it('call with known payload', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    const originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
    MerkleStateManager.prototype.setStateRoot = function (): any {}
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }

    const { osakaGenesis } = osakaGethGenesis
    const customCrypto = await getCryptoFunctions(false)
    const kzg = customCrypto.kzg!
    const { service, server, common, chain } = await setupChain(osakaGenesis, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Osaka,
      customCrypto: { kzg },
    })

    const rpc = getRPCClient(server)
    common.setHardfork(Hardfork.Osaka)
    chain.config.chainCommon.setHardfork(Hardfork.Osaka)

    let res = await rpc.request(`eth_getBlockByNumber`, ['0x0', false])
    assert.equal(res.result.hash, validForkChoiceState.headBlockHash)

    const address = SIGNER_H.address
    await service.execution.vm.stateManager.putAccount(address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(address)
    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(address, account!)
    res = await rpc.request('engine_forkchoiceUpdatedV3', validPayload)
    const payloadId = res.result.payloadId
    assert.exists(payloadId, 'valid payloadId should be received')

    const txBlobs = getBlobs('hello world')
    const txCommitments = blobsToCommitments(kzg, txBlobs)
    const txVersionedHashes = commitmentsToVersionedHashes(txCommitments)
    const txBlobProofs = blobsToProofs(kzg, txBlobs, txCommitments)
    const [txCells, txCellProofs, txCellIndices] = blobsToCellsAndProofs(kzg, txBlobs)

    expect(txCells.length === txBlobs.length * CELLS_PER_EXT_BLOB).toBe(true)
    expect(txCellIndices.length === CELLS_PER_EXT_BLOB).toBe(true)

    expect(() =>
      createTx(
        {
          type: 0x03,
          networkWrapperVersion: 0,
          blobVersionedHashes: txVersionedHashes,
          blobs: txBlobs,
          kzgCommitments: txCommitments,
          kzgProofs: txBlobProofs,
          maxFeePerBlobGas: 1n,
          maxFeePerGas: Units.gwei(10),
          maxPriorityFeePerGas: 100000000n,
          gasLimit: 16000000n,
          to: createZeroAddress(),
        },
        { common },
      ),
    ).toThrowError(/EIP-7594 is active on Common for EIP-4844 network wrapper version/)

    const tx = createTx(
      {
        type: 0x03,
        networkWrapperVersion: 1,
        blobVersionedHashes: txVersionedHashes,
        blobs: txBlobs,
        kzgCommitments: txCommitments,
        kzgProofs: txCellProofs,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: Units.gwei(10),
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 16000000n,
        to: createZeroAddress(),
      },
      { common },
    ).sign(SIGNER_H.privateKey)

    await service.txPool.add(tx, true)

    // // check the blob and proof is available via getBlobsV1
    res = await rpc.request('engine_getBlobsV1', [txVersionedHashes])
    const blobAndProofArr = res.result
    assert.isTrue(blobAndProofArr[0] === null, 'cell wrapper tx should not be found in getBlobsV1')

    res = await rpc.request('engine_getBlobsV2', [txVersionedHashes])
    const blobAndProofsArr = res.result
    for (let i = 0; i < txVersionedHashes.length; i++) {
      const { blob, proofs } = blobAndProofsArr[i]
      const blobCellProofs = txCellProofs.slice(
        i * CELLS_PER_EXT_BLOB,
        (i + 1) * CELLS_PER_EXT_BLOB,
      )
      assert.equal(blob, txBlobs[i])
      assert.equal(proofs.length, blobCellProofs.length)
      for (let j = 0; j < proofs.length; j++) {
        assert.equal(proofs[j], blobCellProofs[j])
      }
    }

    res = await rpc.request('engine_getPayloadV5', [payloadId])

    const { executionPayload, blobsBundle } = res.result
    assert.equal(
      executionPayload.blockHash,
      '0xde5ad0b5d70ae112048b915f66cab04d1942c9eeb0a4b5f1d42fa80cc67167a4',
      'built expected block',
    )
    assert.equal(executionPayload.excessBlobGas, '0x0', 'correct excess blob gas')
    assert.equal(executionPayload.blobGasUsed, '0x20000', 'correct blob gas used')
    const { commitments, proofs, blobs } = blobsBundle
    assert.isTrue(
      commitments.length * CELLS_PER_EXT_BLOB === proofs.length &&
        commitments.length === blobs.length,
      'equal commitments and blobs and corresponding number of proofs',
    )
    assert.equal(blobs.length, 1, '1 blob should be returned')
    assert.equal(blobs[0], txBlobs[0], 'blob should match')
    assert.equal(commitments[0], txCommitments[0], 'commitment should match')
    assert.equal(proofs.length, txCellProofs.length, 'proof lengths should match')
    for (let i = 0; i < proofs.length; i++) {
      assert.equal(proofs[i], txCellProofs[i], 'proofs should match')
    }

    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
    MerkleStateManager.prototype.shallowCopy = originalStateManagerCopy
  })
}, 30000)
