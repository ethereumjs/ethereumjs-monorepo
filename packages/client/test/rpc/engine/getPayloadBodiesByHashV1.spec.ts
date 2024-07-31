import { createBlock, createHeader } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { createTxFromTxData } from '@ethereumjs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { TOO_LARGE_REQUEST } from '../../../src/rpc/error-code.js'
import genesisJSON from '../../testdata/geth-genesis/eip4844.json'
import preShanghaiGenesisJson from '../../testdata/geth-genesis/post-merge.json'
import { baseSetup, getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_getPayloadBodiesByHashV1'

describe(method, () => {
  it('call with too many hashes', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })
    const tooManyHashes: string[] = []
    for (let x = 0; x < 35; x++) {
      tooManyHashes.push(bytesToHex(randomBytes(32)))
    }
    const res = await rpc.request(method, [tooManyHashes])
    assert.equal(res.error.code, TOO_LARGE_REQUEST)
    assert.ok(res.error.message.includes('More than 32 execution payload bodies requested'))
  })

  it('call with valid parameters', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
    const originalStateManagerCopy = DefaultStateManager.prototype.shallowCopy
    DefaultStateManager.prototype.setStateRoot = function (): any {}
    DefaultStateManager.prototype.shallowCopy = function () {
      return this
    }
    const { chain, service, server, common } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
    })
    const rpc = getRpcClient(server)
    common.setHardfork(Hardfork.Cancun)
    const pkey = hexToBytes('0x9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355')
    const address = createAddressFromPrivateKey(pkey)
    await service.execution.vm.stateManager.putAccount(address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(address)

    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(address, account!)
    const tx = createTxFromTxData(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: 10000000000n,
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
      },
      { common },
    ).sign(pkey)
    const tx2 = createTxFromTxData(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: 10000000000n,
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
        nonce: 1n,
      },
      { common },
    ).sign(pkey)
    const block = createBlock(
      {
        transactions: [tx],
        header: createHeader(
          { parentHash: chain.genesis.hash(), number: 1n },
          { common, skipConsensusFormatValidation: true },
        ),
      },
      { common, skipConsensusFormatValidation: true },
    )
    const block2 = createBlock(
      {
        transactions: [tx2],
        header: createHeader(
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

    assert.equal(
      res.result[0].transactions[0],
      bytesToHex(tx.serialize()),
      'got expected transaction from first payload',
    )
    assert.equal(res.result[1], null, 'got null for block not found in chain')
    assert.equal(res.result.length, 3, 'length of response matches number of block hashes sent')

    // Restore setStateRoot
    DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
    DefaultStateManager.prototype.shallowCopy = originalStateManagerCopy
  })

  it('call with valid parameters on pre-Shanghai block', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
    const originalStateManagerCopy = DefaultStateManager.prototype.shallowCopy
    DefaultStateManager.prototype.setStateRoot = function (): any {}
    DefaultStateManager.prototype.shallowCopy = function () {
      return this
    }
    const { chain, service, server, common } = await setupChain(
      preShanghaiGenesisJson,
      'post-merge',
      {
        engine: true,
        hardfork: Hardfork.London,
      },
    )
    const rpc = getRpcClient(server)
    common.setHardfork(Hardfork.London)
    const pkey = hexToBytes('0x9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355')
    const address = createAddressFromPrivateKey(pkey)
    await service.execution.vm.stateManager.putAccount(address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(address)

    account!.balance = 0xfffffffffffffffn
    await service.execution.vm.stateManager.putAccount(address, account!)
    const tx = createTxFromTxData(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: 10000000000n,
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
      },
      { common },
    ).sign(pkey)
    const tx2 = createTxFromTxData(
      {
        type: 0x01,
        maxFeePerBlobGas: 1n,
        maxFeePerGas: 10000000000n,
        maxPriorityFeePerGas: 100000000n,
        gasLimit: 30000000n,
        nonce: 1n,
      },
      { common },
    ).sign(pkey)
    const block = createBlock(
      {
        transactions: [tx],
        header: createHeader(
          { parentHash: chain.genesis.hash(), number: 1n },
          { common, skipConsensusFormatValidation: true },
        ),
      },
      { common, skipConsensusFormatValidation: true },
    )
    const block2 = createBlock(
      {
        transactions: [tx2],
        header: createHeader(
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

    assert.equal(
      res.result[0].withdrawals,
      null,
      'got null for withdrawals field on pre-Shanghai block',
    )

    // Restore setStateRoot
    DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
    DefaultStateManager.prototype.shallowCopy = originalStateManagerCopy
  })
})
