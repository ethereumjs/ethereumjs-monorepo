import { Block, BlockHeader, executionPayloadFromBeaconPayload } from '@ethereumjs/block'
import { initKZG } from '@ethereumjs/util'
import { createKZG } from 'kzg-wasm'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import blocks from '../../testdata/blocks/kaustinen2.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen2.json'
import { getRpcClient, setupChain } from '../helpers.js'

import type { Chain } from '../../../src/blockchain'
import type { Common } from '@ethereumjs/common'
import type { HttpClient } from 'jayson/promise'
const genesisVerkleStateRoot = '0x5e8519756841faf0b2c28951c451b61a4b407b70a5ce5b57992f4bec973173ff'
const genesisVerkleBlockHash = '0x0884fa3d670543463f7e1d9ea007332e1f8a3564ecf891de95a76e751cde45d7'

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

async function runBlock(
  { chain, rpc, common }: { chain: Chain; rpc: HttpClient; common: Common },
  { execute, parent }: { execute: any; parent: any }
) {
  const blockCache = chain.blockCache

  const parentPayload = executionPayloadFromBeaconPayload(parent as any)
  const parentBlock = await Block.fromExecutionPayload(parentPayload, { common })
  blockCache.remoteBlocks.set(parentPayload.blockHash.slice(2), parentBlock)
  blockCache.executedBlocks.set(parentPayload.blockHash.slice(2), parentBlock)

  const executePayload = executionPayloadFromBeaconPayload(execute as any)
  const res = await rpc.request('engine_newPayloadV2', [executePayload])
  assert.equal(res.result.status, 'VALID', 'valid status should be received')
}

describe(`valid verkle network setup`, async () => {
  const kzg = await createKZG()
  initKZG(kzg)

  const { server, chain, common } = await setupChain(genesisJSON, 'post-merge', {
    engine: true,
    genesisStateRoot: genesisVerkleStateRoot,
    customCrypto: { kzg },
  })
  const rpc = getRpcClient(server)
  it('genesis should be correctly setup', async () => {
    const res = await rpc.request('eth_getBlockByNumber', ['0x0', false])

    const block0 = res.result
    assert.equal(block0.hash, genesisVerkleBlockHash)
    assert.equal(block0.stateRoot, genesisVerkleStateRoot)
  })

  // currently it seems the the blocks can't be played one after another as it seems
  // to not do clean init of the statemanager. this isn't a problem in sequential
  // execution, but need to be fixed up in the stateless random execution
  const testCases = [
    // 'block12',
    'block13',
    // 'block16',
  ] as const

  for (const testCase of testCases) {
    it(`run ${testCase}`, async () => {
      await runBlock({ common, chain, rpc }, blocks[testCase])
    })
  }

  it(`reset TD`, () => {
    server.close()
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
