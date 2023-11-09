import { BlockHeader } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { BIGINT_0, bigIntToHex } from '@ethereumjs/util'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS, UNSUPPORTED_FORK } from '../../../src/rpc/error-code'
import blocks from '../../testdata/blocks/kaustinen2.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen2.json'
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { HttpServer } from 'jayson'

const method = 'engine_newPayloadV3'
const [blockData] = blocks

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

export const batchBlocks = async (server: HttpServer) => {
  for (let i = 0; i < 3; i++) {
    const req = params('engine_newPayloadV2', [blocks[i]])
    const expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(server, req, 200, expectRes, false, false)
  }
}
const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'

const { server, common } = await setupChain(genesisJSON, 'post-merge', {
  engine: true,
})
common.setHardforkBy({
  blockNumber: BIGINT_0,
  td: BigInt(genesisJSON.difficulty),
  timestamp: BigInt(genesisJSON.config.pragueTime),
})

describe(`${method}: call with executionPayloadV2`, () => {
  it('check network setup', async () => {
    assert.equal(common.hardfork(), Hardfork.Prague, 'should be set at prague hardfork for verkle')
  })

  it(`reset TD`, () => {
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
