import { bigIntToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS, UNSUPPORTED_FORK } from '../../../src/rpc/error-code.js'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { batchBlocks, getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_newPayloadV3'
const [blockData] = blocks

const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'

describe(`${method}: call with executionPayloadV3`, () => {
  it('invalid call before Cancun', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
    })
    const rpc = getRpcClient(server)
    // get the genesis json with current date
    const validBlock = {
      ...blockData,
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
    }

    const res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot])
    assert.equal(res.error.code, UNSUPPORTED_FORK)
    assert.ok(
      res.error.message.includes('NewPayloadV{1|2} MUST be used before Cancun is activated'),
    )
  })

  it('valid data', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks
    const cancunTime = 1689945325
    // deep copy json and add shanghai and cancun to genesis to avoid contamination
    const cancunJson = JSON.parse(JSON.stringify(genesisJSON))
    cancunJson.config.shanghaiTime = cancunTime
    cancunJson.config.cancunTime = cancunTime
    const { server } = await setupChain(cancunJson, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
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
      assert.equal(res.error.code, INVALID_PARAMS)
      assert.ok(res.error.message.includes(expectedError))
    }

    res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot])
    assert.equal(res.result.status, 'VALID')
  })

  it('fcU and verify that no errors occur on new payload', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks
    const cancunTime = 1689945325
    // deep copy json and add shanghai and cancun to genesis to avoid contamination
    const cancunJson = JSON.parse(JSON.stringify(genesisJSON))
    cancunJson.config.shanghaiTime = cancunTime
    cancunJson.config.cancunTime = cancunTime
    const { server } = await setupChain(cancunJson, 'post-merge', { engine: true })
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

  it('call with executionPayloadV2', () => {
    assert.ok(true, 'TODO: add tests for executionPayloadV2')
    // TODO: add tests for executionPayloadV2
  })
  it('call with executionPayloadV3', () => {
    assert.ok(true, 'TODO: add tests for executionPayloadV2')
    // TODO: add tests for executionPayloadV3
  })
})
