import { Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory, initKZG } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
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

initKZG(kzg, __dirname + '/../../../lib/trustedSetups/devnet4.txt')
const method = 'engine_getBlobsBundleV1'

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
  let req = params('engine_forkchoiceUpdatedV2', validPayload)
  let payloadId
  let expectRes = (res: any) => {
    payloadId = res.body.result.payloadId
  }
  await baseRequest(t, server, req, 200, expectRes, false)
  const tx = TransactionFactory.fromTxData(
    {
      type: 0x05,
      versionedHashes: [],
      maxFeePerDataGas: 1n,
      maxFeePerGas: 10000000000n,
      maxPriorityFeePerGas: 100000000n,
      gasLimit: 30000000n,
    },
    { common }
  ).sign(pkey)

  ;(service.txPool as any).vm._common.setHardfork(Hardfork.ShardingForkDev)
  await service.txPool.add(tx, true)
  req = params('engine_getPayloadV3', [payloadId])
  expectRes = (res: any) => {
    t.equal(
      res.body.result.executionPayload.blockHash,
      '0x467ffd05100e34088fbc3eee3966304a3330ac37fe5d85c1873a867f514112e6',
      'built expected block'
    )
  }

  await baseRequest(t, server, req, 200, expectRes, false)
  req = params(method, [payloadId])
  expectRes = (res: any) => {
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
