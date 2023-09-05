import { BlockHeader } from '@ethereumjs/block'
import { bigIntToHex } from '@ethereumjs/util'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS, UNSUPPORTED_FORK } from '../../../src/rpc/error-code'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { HttpServer } from 'jayson'

const method = 'engine_newPayloadV3'
const [blockData] = blocks

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

export const batchBlocks = async (server: HttpServer) => {
  for (let i = 0; i < 3; i++) {
    const req = params('engine_newPayloadV1', [blocks[i]])
    const expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(server, req, 200, expectRes, false, false)
  }
}
const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'

describe(`${method}: call with executionPayloadV3`, () => {
  it('invalid call before Cancun', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
    })
    // get the genesis json with current date
    const validBlock = {
      ...blockData,
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
    }

    const req = params(method, [validBlock, [], parentBeaconBlockRoot])
    const expectRes = checkError(
      UNSUPPORTED_FORK,
      'NewPayloadV{1|2} MUST be used before Cancun is activated'
    )
    await baseRequest(server, req, 200, expectRes)
  })

  it('valid data', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks
    const cancunTime = 1689945325
    // deep copy json and add shanghai and cancun to genesis to avoid contamination
    const cancunJson = JSON.parse(JSON.stringify(genesisJSON))
    cancunJson.config.shanghaiTime = cancunTime
    cancunJson.config.cancunTime = cancunTime
    const { server } = await setupChain(cancunJson, 'post-merge', { engine: true })

    const validBlock = {
      ...blockData,
      timestamp: bigIntToHex(BigInt(cancunTime)),
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
      blockHash: '0x80d8858cfe4387e29e1853ad6e028cd9c8a40739416c93c2ae0c04410ebeee3c',
      stateRoot: '0x3c49a0c1f34b6e0ad9b04deb44bcc459f1c8d994214ce907ff2682ffe779a31a',
    }
    let expectRes, req

    const oldMethods = ['engine_newPayloadV1', 'engine_newPayloadV2']
    const expectedErrors = [
      'NewPayloadV2 MUST be used after Shanghai is activated',
      'NewPayloadV3 MUST be used after Cancun is activated',
    ]
    for (let index = 0; index < oldMethods.length; index++) {
      const oldMethod = oldMethods[index]
      const expectedError = expectedErrors[index]
      // extra params for old methods should be auto ignored
      req = params(oldMethod, [validBlock, [], parentBeaconBlockRoot])
      expectRes = checkError(INVALID_PARAMS, expectedError)
      await baseRequest(server, req, 200, expectRes, false, false)
    }

    req = params(method, [validBlock, [], parentBeaconBlockRoot])
    expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
      assert.equal(res.body.result.latestValidHash, validBlock.blockHash)
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it('fcU and verify that no errors occur on new payload', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks
    const cancunTime = 1689945325
    // deep copy json and add shanghai and cancun to genesis to avoid contamination
    const cancunJson = JSON.parse(JSON.stringify(genesisJSON))
    cancunJson.config.shanghaiTime = cancunTime
    cancunJson.config.cancunTime = cancunTime
    const { server } = await setupChain(cancunJson, 'post-merge', { engine: true })

    await batchBlocks(server)

    let req = params('engine_forkchoiceUpdatedV3', [
      {
        headBlockHash: blocks[2].blockHash,
        finalizedBlockHash: blocks[2].blockHash,
        safeBlockHash: blocks[2].blockHash,
      },
    ])

    // Let's set new head hash
    const expectResFcu = (res: any) => {
      assert.equal(res.body.result.payloadStatus.status, 'VALID')
    }
    await baseRequest(server, req, 200, expectResFcu, false, false)

    // use new payload v1 as blocks all belong to pre-shanghai
    req = params('engine_newPayloadV1', [blockData])

    const expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it(`reset TD`, () => {
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
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
