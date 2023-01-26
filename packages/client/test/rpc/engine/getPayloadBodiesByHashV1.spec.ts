import { Block, BlockHeader } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { TOO_LARGE_REQUEST } from '../../../lib/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/eip4844.json')
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

const method = 'engine_getPayloadBodiesByHashV1'

tape(`${method}: call with too many hashes`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })
  const tooManyHashes: string[] = []
  for (let x = 0; x < 35; x++) {
    tooManyHashes.push('0x' + randomBytes(32).toString('hex'))
  }
  const req = params(method, [tooManyHashes])
  const expectRes = checkError(
    t,
    TOO_LARGE_REQUEST,
    'More than 32 execution payload bodies requested'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape.only(`${method}: call with valid parameters`, async (t) => {
  // Disable stateroot validation in TxPool since valid state root isn't available
  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  const originalStateManagerCopy = DefaultStateManager.prototype.copy
  DefaultStateManager.prototype.setStateRoot = function (): any {}
  DefaultStateManager.prototype.copy = function () {
    return this
  }
  const { chain, service, server, common } = await setupChain(genesisJSON, 'post-merge', {
    engine: true,
    hardfork: Hardfork.ShardingForkDev,
  })
  common.setHardfork(Hardfork.ShardingForkDev)
  const pkey = Buffer.from(
    '9c9996335451aab4fc4eac58e31a8c300e095cdbcee532d53d09280e83360355',
    'hex'
  )
  const address = Address.fromPrivateKey(pkey)
  const account = await service.execution.vm.stateManager.getAccount(address)

  account.balance = 0xfffffffffffffffn
  await service.execution.vm.stateManager.putAccount(address, account)
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
    { skipConsensusFormatValidation: true }
  )

  const num = await chain.putBlocks([block, block2], true)

  const req = params(method, [['0x' + block.hash().toString('hex')]])
  const expectRes = (res: any) => {
    t.equal(
      res.body.result.blockHash,
      '0x467ffd05100e34088fbc3eee3966304a3330ac37fe5d85c1873a867f514112e6',
      'got expected blockHash'
    )
  }
  await baseRequest(t, server, req, 200, expectRes, false)
  // Restore setStateRoot
  DefaultStateManager.prototype.setStateRoot = originalSetStateRoot
  DefaultStateManager.prototype.copy = originalStateManagerCopy
})
