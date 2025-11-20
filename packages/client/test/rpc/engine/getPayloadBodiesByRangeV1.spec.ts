import { createBlock, createBlockHeader } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { SIGNER_A, eip4844GethGenesis, postMergeGethGenesis } from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
import { Account, Units, bytesToHex } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { INVALID_PARAMS, TOO_LARGE_REQUEST } from '../../../src/rpc/error-code.ts'
import { baseSetup, getRPCClient, setupChain } from '../helpers.ts'

const method = 'engine_getPayloadBodiesByRangeV1'

describe(method, () => {
  it('call with too many hashes', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const res = await rpc.request(method, ['0x1', '0x55'])
    assert.strictEqual(res.error.code, TOO_LARGE_REQUEST)
    assert.isTrue(res.error.message.includes('More than 32 execution payload bodies requested'))
  })

  it('call with invalid parameters', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const res = await rpc.request(method, ['0x0', '0x0'])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('Start and Count parameters cannot be less than 1'))
  })

  it('call with valid parameters', async () => {
    MerkleStateManager.prototype.setStateRoot = vi.fn()
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

    const res = await rpc.request(method, ['0x1', '0x4'])
    assert.strictEqual(
      res.result[0].transactions[0],
      bytesToHex(tx.serialize()),
      'got expected transaction from first payload',
    )
    assert.strictEqual(
      res.result.length,
      2,
      'length of response matches start of range up to highest known block',
    )

    const res2 = await rpc.request(method, ['0x3', '0x2'])
    assert.strictEqual(
      res2.result.length,
      0,
      'got empty array when start of requested range is beyond current chain head',
    )
  })

  it('call with valid parameters on pre-Shanghai hardfork', async () => {
    MerkleStateManager.prototype.setStateRoot = vi.fn()
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }
    const { chain, service, server, common } = await setupChain(postMergeGethGenesis, 'london', {
      engine: true,
      hardfork: Hardfork.London,
    })
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

    const res = await rpc.request(method, ['0x1', '0x4'])

    assert.isNull(res.result[0].withdrawals, 'withdrawals field is null for pre-shanghai blocks')

    service.execution.vm.common.setHardfork(Hardfork.London)
  })
})
