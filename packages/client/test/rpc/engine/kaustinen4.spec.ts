import { Block, BlockHeader, executionPayloadFromBeaconPayload } from '@ethereumjs/block'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import blocks from '../../testdata/blocks/kaustinen4.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen4.json'
import { getRpcClient, setupChain } from '../helpers.js'

import type { Chain } from '../../../src/blockchain'
import type { Common } from '@ethereumjs/common'
import type { HttpClient } from 'jayson/promise'
const genesisVerkleStateRoot = '0x382960711d9ccf58b9db20122e2253eb9bfa99d513f8c9d4e85b55971721f4de'
const genesisVerkleBlockHash = '0x8493ed97fd4314acb6ed519867b086dc698e25df37ebe8f2bc77313537710744'

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
  const { server, chain, common } = await setupChain(genesisJSON, 'post-merge', {
    engine: true,
    genesisStateRoot: genesisVerkleStateRoot,
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
    // "block368",
    'block374',
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
