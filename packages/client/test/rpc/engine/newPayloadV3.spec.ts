import { beaconData, postMergeGethGenesis } from '@ethereumjs/testdata'
import { bigIntToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS, UNSUPPORTED_FORK } from '../../../src/rpc/error-code.ts'
import { batchBlocks, getRPCClient, setupChain } from '../helpers.ts'

const method = 'engine_newPayloadV3'
const [blockData] = beaconData

const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'

describe(`${method}: call with executionPayloadV3`, () => {
  it('invalid call before Cancun', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', {
      engine: true,
    })
    const rpc = getRPCClient(server)
    // get the genesis JSON with current date
    const validBlock = {
      ...blockData,
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
    }

    const res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot])
    assert.strictEqual(res.error.code, UNSUPPORTED_FORK)
    assert.isTrue(
      res.error.message.includes('NewPayloadV{1|2} MUST be used before Cancun is activated'),
    )
  })

  it('valid data', async () => {
    // get the genesis JSON with late enough date with respect to block data in batchBlocks
    const cancunTime = 1689945325
    // deep copy JSON and add shanghai and cancun to genesis to avoid contamination
    const cancunJSON = JSON.parse(JSON.stringify(postMergeGethGenesis))
    cancunJSON.config.shanghaiTime = cancunTime
    cancunJSON.config.cancunTime = cancunTime
    const { server } = await setupChain(cancunJSON, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const validBlock = {
      ...blockData,
      timestamp: bigIntToHex(BigInt(cancunTime)),
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
      blockHash: '0xbb9bd9ec0b48b52556ce0180afcefc31d59dd288914b931ff32ff9813519fa7f',
      stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
    }
    let res

    const oldMethods = ['engine_newPayloadV1', 'engine_newPayloadV2']
    const expectedErrors = [
      'NewPayloadV2 MUST be used after Shanghai is activated',
      'NewPayloadV3 MUST be used after Cancun is activated',
    ]
    for (let index = 0; index < oldMethods.length; index++) {
      const oldMethod = oldMethods[index]
      const expectedError = expectedErrors[index]
      // extra params for old methods should be auto ignored
      res = await rpc.request(oldMethod, [validBlock, [], parentBeaconBlockRoot])
      assert.strictEqual(res.error.code, INVALID_PARAMS)
      assert.isTrue(res.error.message.includes(expectedError))
    }

    res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot])
    assert.strictEqual(res.result.status, 'VALID')
  })

  it('fcU and verify that no errors occur on new payload', async () => {
    // get the genesis JSON with late enough date with respect to block data in batchBlocks
    const cancunTime = 1689945325
    // deep copy JSON and add shanghai and cancun to genesis to avoid contamination
    const cancunJSON = JSON.parse(JSON.stringify(postMergeGethGenesis))
    cancunJSON.config.shanghaiTime = cancunTime
    cancunJSON.config.cancunTime = cancunTime
    const { server } = await setupChain(cancunJSON, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    await batchBlocks(rpc, beaconData)

    // Let's set new head hash
    let res = await rpc.request('engine_forkchoiceUpdatedV3', [
      {
        headBlockHash: beaconData[2].blockHash,
        finalizedBlockHash: beaconData[2].blockHash,
        safeBlockHash: beaconData[2].blockHash,
      },
    ])
    assert.strictEqual(res.result.payloadStatus.status, 'VALID')

    // use new payload v1 as beaconData all belong to pre-shanghai
    res = await rpc.request('engine_newPayloadV1', [blockData])
    assert.strictEqual(res.result.status, 'VALID')
  })

  it('call with executionPayloadV2', () => {
    assert.isTrue(true, 'TODO: add tests for executionPayloadV2')
    // TODO: add tests for executionPayloadV2
  })
  it('call with executionPayloadV3', () => {
    assert.isTrue(true, 'TODO: add tests for executionPayloadV2')
    // TODO: add tests for executionPayloadV3
  })
})
