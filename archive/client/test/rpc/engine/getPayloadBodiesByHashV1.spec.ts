import { createBlock, createBlockHeader } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { SIGNER_A, eip4844GethGenesis, postMergeGethGenesis } from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
import { Account, Units, bytesToHex, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { TOO_LARGE_REQUEST } from '../../../src/rpc/error-code.ts'
import { baseSetup, getRPCClient, setupChain } from '../helpers.ts'

const method = 'engine_getPayloadBodiesByHashV1'

describe(method, () => {
  it('call with too many hashes', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })
    const tooManyHashes: string[] = []
    for (let x = 0; x < 35; x++) {
      tooManyHashes.push(bytesToHex(randomBytes(32)))
    }
    const res = await rpc.request(method, [tooManyHashes])
    assert.strictEqual(res.error.code, TOO_LARGE_REQUEST)
    assert.isTrue(res.error.message.includes('More than 32 execution payload bodies requested'))
  })

  it('call with valid parameters', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    const originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
    MerkleStateManager.prototype.setStateRoot = function (): any {}
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }
    const { chain, service, server, common } = await setupChain(eip4844GethGenesis, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
    })
    const rpc = getRPCClient(server)
    common.setHardfork(Hardfork.Cancun)
    await service.execution.vm.stateManager.putAccount(SIGNER_A.address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(SIGNER_A.address)
    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(SIGNER_A.address, account!)
    const tx = createTx(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: Units.gwei(10),
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
      },
      { common },
    ).sign(SIGNER_A.privateKey)
    const tx2 = createTx(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: Units.gwei(10),
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
        nonce: 1n,
      },
      { common },
    ).sign(SIGNER_A.privateKey)
    const block = createBlock(
      {
        transactions: [tx],
        header: createBlockHeader(
          { parentHash: chain.genesis.hash(), number: 1n },
          { common, skipConsensusFormatValidation: true },
        ),
      },
      { common, skipConsensusFormatValidation: true },
    )
    const block2 = createBlock(
      {
        transactions: [tx2],
        header: createBlockHeader(
          { parentHash: block.hash(), number: 2n },
          { common, skipConsensusFormatValidation: true },
        ),
      },
      { common, skipConsensusFormatValidation: true },
    )

    await chain.putBlocks([block, block2], true)

    const res = await rpc.request(method, [
      [bytesToHex(block.hash()), bytesToHex(randomBytes(32)), bytesToHex(block2.hash())],
    ])

    assert.strictEqual(
      res.result[0].transactions[0],
      bytesToHex(tx.serialize()),
      'got expected transaction from first payload',
    )
    assert.strictEqual(res.result[1], null, 'got null for block not found in chain')
    assert.strictEqual(
      res.result.length,
      3,
      'length of response matches number of block hashes sent',
    )

    // Restore setStateRoot
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
    MerkleStateManager.prototype.shallowCopy = originalStateManagerCopy
  })

  it('call with valid parameters on pre-Shanghai block', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    const originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
    MerkleStateManager.prototype.setStateRoot = function (): any {}
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }
    const { chain, service, server, common } = await setupChain(
      postMergeGethGenesis,
      'post-merge',
      {
        engine: true,
        hardfork: Hardfork.London,
      },
    )
    const rpc = getRPCClient(server)
    common.setHardfork(Hardfork.London)
    await service.execution.vm.stateManager.putAccount(SIGNER_A.address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(SIGNER_A.address)

    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(SIGNER_A.address, account!)
    const tx = createTx(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: Units.gwei(10),
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
      },
      { common },
    ).sign(SIGNER_A.privateKey)
    const tx2 = createTx(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: Units.gwei(10),
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
        nonce: 1n,
      },
      { common },
    ).sign(SIGNER_A.privateKey)
    const block = createBlock(
      {
        transactions: [tx],
        header: createBlockHeader(
          { parentHash: chain.genesis.hash(), number: 1n },
          { common, skipConsensusFormatValidation: true },
        ),
      },
      { common, skipConsensusFormatValidation: true },
    )
    const block2 = createBlock(
      {
        transactions: [tx2],
        header: createBlockHeader(
          { parentHash: block.hash(), number: 2n },
          { common, skipConsensusFormatValidation: true },
        ),
      },
      { common, skipConsensusFormatValidation: true },
    )

    await chain.putBlocks([block, block2], true)

    const res = await rpc.request(method, [
      [bytesToHex(block.hash()), bytesToHex(randomBytes(32)), bytesToHex(block2.hash())],
    ])

    assert.strictEqual(
      res.result[0].withdrawals,
      null,
      'got null for withdrawals field on pre-Shanghai block',
    )

    // Restore setStateRoot
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
    MerkleStateManager.prototype.shallowCopy = originalStateManagerCopy
  })
})
