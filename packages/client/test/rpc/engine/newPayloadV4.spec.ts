import { bigIntToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { batchBlocks, getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_newPayloadV4'
const [blockData] = blocks

const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'

describe(`${method}: call with executionPayloadV4`, () => {
  it('valid data', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks
    const pragueTime = 1689945325
    // deep copy json and add shanghai and cancun to genesis to avoid contamination
    const pragueJson = JSON.parse(JSON.stringify(genesisJSON))
    pragueJson.config.shanghaiTime = pragueTime
    pragueJson.config.cancunTime = pragueTime
    pragueJson.config.pragueTime = pragueTime
    const { server } = await setupChain(pragueJson, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    const validBlock = {
      ...blockData,
      timestamp: bigIntToHex(BigInt(pragueTime)),
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
      depositReceipts: [],
      withdrawalRequests: [],
      blockHash: '0x87994ea69d14924d908ed979bf2aadd91f0954f95792c3fcf442d2513af957c4',
      stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
    }
    let res

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
      assert.equal(res.error.code, INVALID_PARAMS)
      assert.ok(res.error.message.includes(expectedError))
    }

    res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot])
    // TODO: start the genesis state with deployed 7002 contract
    assert.equal(res.result.status, 'INVALID')
    assert.ok(res.result.validationError.includes('attempt to accumulate eip-7002 requests failed'))
  })

  it('fcU and verify that no errors occur on new payload', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks
    const pragueTime = 1689945325
    // deep copy json and add shanghai and cancun to genesis to avoid contamination
    const pragueJson = JSON.parse(JSON.stringify(genesisJSON))
    pragueJson.config.shanghaiTime = pragueTime
    pragueJson.config.cancunTime = pragueTime
    const { server } = await setupChain(pragueJson, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    await batchBlocks(rpc, blocks)

    // Let's set new head hash
    let res = await rpc.request('engine_forkchoiceUpdatedV3', [
      {
        headBlockHash: blocks[2].blockHash,
        finalizedBlockHash: blocks[2].blockHash,
        safeBlockHash: blocks[2].blockHash,
      },
    ])
    assert.equal(res.result.payloadStatus.status, 'VALID')

    // use new payload v1 as blocks all belong to pre-shanghai
    res = await rpc.request('engine_newPayloadV1', [blockData])
    assert.equal(res.result.status, 'VALID')
  })
})
