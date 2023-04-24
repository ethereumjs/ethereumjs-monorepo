import { Block, BlockHeader } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory } from '@ethereumjs/tx'
import { Account, Address, bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS, TOO_LARGE_REQUEST } from '../../../lib/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/eip4844.json')
import preShanghaiGenesisJSON = require('../../testdata/geth-genesis/post-merge.json')
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

const method = 'engine_getPayloadBodiesByRangeV1'

tape(`${method}: call with too many hashes`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, ['0x1', '0x55'])
  const expectRes = checkError(
    t,
    TOO_LARGE_REQUEST,
    'More than 32 execution payload bodies requested'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid parameters`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, ['0x0', '0x0'])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'Start and Count parameters cannot be less than 1'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid parameters`, async (t) => {
  // Disable stateroot validation in TxPool since valid state root isn't available
  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  const originalStateManagerCopy = DefaultStateManager.prototype.copy
  DefaultStateManager.prototype.setStateRoot = function (): any {}
  DefaultStateManager.prototype.copy = function () {
    return this
  }
  const { chain, service, server, common } = await setupChain(genesisJSON, 'post-merge', {
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
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x01,
      maxFeePerDataGas: 1n,
      maxFeePerGas: 10000000000n,
      maxPriorityFeePerGas: 100000000n,
      gasLimit: 30000000n,
    },
    { common }
  ).sign(pkey)
  const tx2 = TransactionFactory.fromTxData(
    {
      type: 0x01,
      maxFeePerDataGas: 1n,
      maxFeePerGas: 10000000000n,
      maxPriorityFeePerGas: 100000000n,
      gasLimit: 30000000n,
      nonce: 1n,
    },
    { common }
  ).sign(pkey)
  const block = Block.fromBlockData(
    {
      transactions: [tx],
      header: BlockHeader.fromHeaderData(
        { parentHash: chain.genesis.hash(), number: 1n },
        { common, skipConsensusFormatValidation: true }
      ),
    },
    { common, skipConsensusFormatValidation: true }
  )
  const block2 = Block.fromBlockData(
    {
      transactions: [tx2],
      header: BlockHeader.fromHeaderData(
        { parentHash: block.hash(), number: 2n },
        { common, skipConsensusFormatValidation: true }
      ),
    },
    { common, skipConsensusFormatValidation: true }
  )

  await chain.putBlocks([block, block2], true)

  const req = params(method, ['0x1', '0x4'])
  const expectRes = (res: any) => {
    t.equal(
      res.body.result[0].transactions[0],
      bytesToPrefixedHexString(tx.serialize()),
      'got expected transaction from first payload'
    )
    t.equal(
      res.body.result.length,
      2,
      'length of response matches start of range up to highest known block'
    )
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  const req2 = params(method, ['0x3', '0x2'])
  const expectRes2 = (res: any) => {
    t.equal(
      res.body.result.length,
      0,
      'got empty array when start of requested range is beyond current chain head'
    )
  }
  await baseRequest(t, server, req2, 200, expectRes2)
  // Restore setStateRoot
  DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
  DefaultStateManager.prototype.copy = originalStateManagerCopy
})

tape(`${method}: call with valid parameters on pre-Shanghai hardfork`, async (t) => {
  // Disable stateroot validation in TxPool since valid state root isn't available
  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  const originalStateManagerCopy = DefaultStateManager.prototype.copy
  DefaultStateManager.prototype.setStateRoot = function (): any {}
  DefaultStateManager.prototype.copy = function () {
    return this
  }
  const { chain, service, server, common } = await setupChain(preShanghaiGenesisJSON, 'london', {
    engine: true,
    hardfork: Hardfork.London,
  })
  common.setHardfork(Hardfork.London)
  const pkey = hexStringToBytes('9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355')
  const address = Address.fromPrivateKey(pkey)
  await service.execution.vm.stateManager.putAccount(address, new Account())
  const account = await service.execution.vm.stateManager.getAccount(address)

  account!.balance = 0xfffffffffffffffn
  await service.execution.vm.stateManager.putAccount(address, account!)
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x01,
      maxFeePerDataGas: 1n,
      maxFeePerGas: 10000000000n,
      maxPriorityFeePerGas: 100000000n,
      gasLimit: 30000000n,
    },
    { common }
  ).sign(pkey)
  const tx2 = TransactionFactory.fromTxData(
    {
      type: 0x01,
      maxFeePerDataGas: 1n,
      maxFeePerGas: 10000000000n,
      maxPriorityFeePerGas: 100000000n,
      gasLimit: 30000000n,
      nonce: 1n,
    },
    { common }
  ).sign(pkey)
  const block = Block.fromBlockData(
    {
      transactions: [tx],
      header: BlockHeader.fromHeaderData(
        { parentHash: chain.genesis.hash(), number: 1n },
        { common, skipConsensusFormatValidation: true }
      ),
    },
    { common, skipConsensusFormatValidation: true }
  )
  const block2 = Block.fromBlockData(
    {
      transactions: [tx2],
      header: BlockHeader.fromHeaderData(
        { parentHash: block.hash(), number: 2n },
        { common, skipConsensusFormatValidation: true }
      ),
    },
    { common, skipConsensusFormatValidation: true }
  )

  await chain.putBlocks([block, block2], true)

  const req = params(method, ['0x1', '0x4'])
  const expectRes = (res: any) => {
    t.equal(
      res.body.result[0].withdrawals,
      null,
      'withdrawals field is null for pre-shanghai blocks'
    )
  }
  service.execution.vm._common.setHardfork(Hardfork.London)
  await baseRequest(t, server, req, 200, expectRes)
  // Restore setStateRoot
  DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
  DefaultStateManager.prototype.copy = originalStateManagerCopy
})
