import { Block, BlockHeader, executionPayloadFromBeaconPayload } from '@ethereumjs/block'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import blocks from '../../testdata/blocks/kaustinen2.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen2.json'
import { baseRequest, params, setupChain } from '../helpers'

import type { Chain } from '../../../src/blockchain'
import type { Common } from '@ethereumjs/common'
import type { HttpServer } from 'jayson'
const genesisVerkleStateRoot = '0x5e8519756841faf0b2c28951c451b61a4b407b70a5ce5b57992f4bec973173ff'
const genesisVerkleBlockHash = '0x0884fa3d670543463f7e1d9ea007332e1f8a3564ecf891de95a76e751cde45d7'

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

async function runBlock(
  { chain, server, common }: { chain: Chain; server: HttpServer; common: Common },
  { execute, parent }: { execute: any; parent: any }
) {
  const blockCache = chain.blockCache

  const parentPayload = executionPayloadFromBeaconPayload(parent as any)
  const parentBlock = await Block.fromExecutionPayload(parentPayload, { common })
  blockCache.remoteBlocks.set(parentPayload.blockHash.slice(2), parentBlock)
  blockCache.executedBlocks.set(parentPayload.blockHash.slice(2), parentBlock)

  const executePayload = executionPayloadFromBeaconPayload(execute as any)
  const req = params('engine_newPayloadV2', [executePayload])
  const expectRes = (res: any) => {
    assert.equal(res.body.result.status, 'VALID')
  }

  await baseRequest(server, req, 200, expectRes, false, false)
}

describe(`valid verkle network setup`, async () => {
  const { server, chain, common } = await setupChain(genesisJSON, 'post-merge', {
    engine: true,
    genesisStateRoot: genesisVerkleStateRoot,
  })

  it('genesis should be correctly setup', async () => {
    const req = params('eth_getBlockByNumber', ['0x0', false])
    const expectRes = (res: any) => {
      const block0 = res.body.result
      assert.equal(block0.hash, genesisVerkleBlockHash)
      assert.equal(block0.stateRoot, genesisVerkleStateRoot)
    }
    await baseRequest(server, req, 200, expectRes, false, false)
  })

  const testCases = ['block13', 'block16']
  for (const testCase of testCases) {
    it(`run ${testCase}`, async () => {
      await runBlock({ common, chain, server }, blocks[testCase])
    })
  }

  it(`reset TD`, () => {
    server.close()
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
