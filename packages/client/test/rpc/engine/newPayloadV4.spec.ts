import { SIGNER_H, beaconData, pragueGethGenesis } from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
import { Units, bigIntToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { getRPCClient, setupChain } from '../helpers.ts'

const method = 'engine_newPayloadV4'
const [blockData] = beaconData

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

describe(`${method}: call with executionPayloadV4`, () => {
  it('valid data', async () => {
    // get the genesis with late enough date with respect to block data in batchBlocks
    const { pragueGenesis, pragueTime } = pragueGethGenesis
    const { service, server } = await setupChain(pragueGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    let res

    res = await rpc.request(`eth_getBlockByNumber`, ['0x0', false])
    assert.strictEqual(res.result.hash, validForkChoiceState.headBlockHash)

    const validBlock = {
      ...blockData,
      timestamp: bigIntToHex(BigInt(pragueTime)),
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
      parentHash: '0xa85d6596cb45ab895555e76857c45440a6cf74b1895fb6f560dacf45b7db782b',
      stateRoot: '0x0fc3b4ec20ec28087d2784e973634e12818998dce76ecfb27ea34c65e058e39a',
      blockHash: '0x81442acca0855f07575f7d80ba5f1830e3e4192d8dc278f224f7582d59357821',
    }

    const oldMethods = ['engine_newPayloadV1', 'engine_newPayloadV2', 'engine_newPayloadV3']
    const expectedErrors = [
      'NewPayloadV2 MUST be used after Shanghai is activated',
      'NewPayloadV3 MUST be used after Cancun is activated',
      'NewPayloadV4 MUST be used after Prague is activated',
    ]
    for (let index = 0; index < oldMethods.length; index++) {
      const oldMethod = oldMethods[index]
      const expectedError = expectedErrors[index]
      // extra params for old methods should be auto ignored
      res = await rpc.request(oldMethod, [validBlock, [], parentBeaconBlockRoot])
      assert.strictEqual(res.error.code, INVALID_PARAMS)
      assert.isTrue(res.error.message.includes(expectedError))
    }

    res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot, []])
    assert.strictEqual(res.result.status, 'VALID')

    res = await rpc.request('engine_forkchoiceUpdatedV3', validPayload)
    const payloadId = res.result.payloadId
    assert.isTrue(
      payloadId !== undefined && payloadId !== null,
      'valid payloadId should be received',
    )

    // SIGNER_H.address 0x610adc49ecd66cbf176a8247ebd59096c031bd9f has been sufficiently funded in genesis
    const pk = SIGNER_H.privateKey
    const depositTx = createTx({
      data: '0x22895118000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001208cd4e5a69709cf8ee5b1b73d6efbf3f33bcac92fb7e4ce62b2467542fb50a72d0000000000000000000000000000000000000000000000000000000000000030ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030000000000000000000000000000000000000000000000000000000000000060a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d769',
      value: Units.ether(32),
      gasLimit: 30000000n,
      maxFeePerGas: 100n,
      type: 2,
      to: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
    }).sign(pk)
    await service.txPool.add(depositTx, true)

    res = await rpc.request('engine_getPayloadV4', [payloadId])
    const getPayloadResult = res.result
    // recall getpayload to verify if all of cached payload is returned
    res = await rpc.request('engine_getPayloadV4', [payloadId])
    const getPayloadRetryResult = res.result
    const hasAllKeys = Object.keys(getPayloadResult).reduce(
      (acc, key) => acc && Object.keys(getPayloadRetryResult).includes(key),
      true,
    )
    assert(hasAllKeys === true, 'all cached data should be returned on retry')

    const { executionPayload, executionRequests } = getPayloadResult
    assert.strictEqual(
      executionRequests?.length,
      1,
      'executionRequests should have the deposit request, and should exclude the other requests (these are empty)',
    )

    const depositRequestBytes = hexToBytes(executionRequests[0])
    assert.strictEqual(
      depositRequestBytes[0],
      0x00,
      'deposit request byte 0 is the deposit request identifier byte (0x00)',
    )
    assert.isNotEmpty(depositRequestBytes, 'deposit request includes data (and is thus not empty)')

    res = await rpc.request(method, [
      executionPayload,
      [],
      parentBeaconBlockRoot,
      executionRequests,
    ])
    assert.strictEqual(res.result.status, 'VALID')

    const newBlockHashHex = executionPayload.blockHash
    // add this block to the blockchain
    res = await rpc.request('engine_forkchoiceUpdatedV3', [
      {
        safeBlockHash: newBlockHashHex,
        finalizedBlockHash: newBlockHashHex,
        headBlockHash: newBlockHashHex,
      },
      null,
    ])
    assert.strictEqual(res.result.payloadStatus.status, 'VALID')
  })
})
