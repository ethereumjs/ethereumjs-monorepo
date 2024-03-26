import { Block, BlockHeader, executionPayloadFromBeaconPayload } from '@ethereumjs/block'
import { hexToBytes } from '@ethereumjs/util'
import { readFileSync } from 'fs'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import blocks from '../../testdata/blocks/kaustinen4.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen4.json'
import { getRpcClient, setupChain } from '../helpers.js'

import type { Chain } from '../../../src/blockchain'
import type { BeaconPayloadJson } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { HttpClient } from 'jayson/promise'
const genesisVerkleStateRoot = '0x382960711d9ccf58b9db20122e2253eb9bfa99d513f8c9d4e85b55971721f4de'
const genesisVerkleBlockHash = '0x8493ed97fd4314acb6ed519867b086dc698e25df37ebe8f2bc77313537710744'

/**
 * One can run this test in two formats:
 *   1. On the saved blocks, comma separated which are limited (353,368,374,467)
 *      `TEST_SAVED_NUMBERS=353,368,374,467 npx vitest run test/rpc/engine/kaustinen4.spec.ts`
 *   2. Directly pull slots from a kaustinen beacon url
 *     `TEST_ONLINE_SLOTS=345,353..360 PEER_BEACON_URL=https://beacon.verkle-gen-devnet-4.ethpandaops.io npx vitest run test/rpc/engine/kaustinen4.spec.ts`
 *   3. Geth produced testvectors
 *     `TEST_GETH_VEC_DIR=test/testdata/gethk5vecs DEBUG=ethjs,vm:*,evm:*,statemanager:verkle* npx vitest run test/rpc/engine/kaustinen4.spec.ts`
 */

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

async function fetchExecutionPayload(
  peerBeaconUrl: string,
  slot: number | string
): Promise<BeaconPayloadJson> {
  const beaconBlock = await (await fetch(`${peerBeaconUrl}/eth/v2/beacon/blocks/${slot}`)).json()
  return beaconBlock.data.message.body.execution_payload
}

async function runBlock(
  { chain, rpc, common }: { chain: Chain; rpc: HttpClient; common: Common },
  { execute, parent }: { execute: any; parent: any },
  isBeaconData: boolean
) {
  const blockCache = chain.blockCache

  const parentPayload =
    isBeaconData === true ? executionPayloadFromBeaconPayload(parent as any) : parent
  const parentBlock = await Block.fromExecutionPayload(parentPayload, { common })
  blockCache.remoteBlocks.set(parentPayload.blockHash.slice(2), parentBlock)
  blockCache.executedBlocks.set(parentPayload.blockHash.slice(2), parentBlock)

  const executePayload =
    isBeaconData === true ? executionPayloadFromBeaconPayload(execute as any) : execute
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
  // TEST_SAVED_NUMBERS=353,368,374,479
  const savedTestCases = process.env.TEST_SAVED_NUMBERS?.split(',') ?? []

  for (const testCase of savedTestCases) {
    it(`run saved block ${testCase}`, async () => {
      let testData
      let isBeaconData
      if (process.env.SAVED_DATA_DIR !== undefined) {
        const fileName = `${process.env.SAVED_DATA_DIR}/${testCase}.json`
        testData = JSON.parse(readFileSync(fileName))[testCase]
        isBeaconData = false
      } else {
        testData = blocks[testCase]
        isBeaconData = true
      }
      if (testData === undefined) {
        throw Error('unavailable data')
      }
      await runBlock({ common, chain, rpc }, testData, isBeaconData)
    })
  }

  // we can also test online slots (not numbers because ELs don't provide witnesses
  // directly, so we need to pull payload from beacon)
  // TEST_ONLINE_SLOTS=345,375,368..467,
  for (const numberOrRange of process.env.TEST_ONLINE_SLOTS?.split(',') ?? []) {
    if (process.env.PEER_BEACON_URL === undefined) {
      throw Error(`PEER_BEACON_URL env is not defined`)
    }

    const rangeSplit = numberOrRange.split('..')
    const startSlot = parseInt(rangeSplit[0])
    const endSlot = parseInt(rangeSplit[1] ?? rangeSplit[0])
    let parent = await fetchExecutionPayload(process.env.PEER_BEACON_URL, startSlot - 1)
    for (let i = startSlot; i <= endSlot; i++) {
      const execute = await fetchExecutionPayload(process.env.PEER_BEACON_URL, i)
      it(`run fetched block slot: ${i} number: ${execute.block_number}`, async () => {
        await runBlock({ common, chain, rpc }, { parent, execute }, true)
        parent = execute
      })
    }
  }

  if (process.env.TEST_GETH_VEC_DIR !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const gethVecs = await loadGethVectors(process.env.TEST_GETH_VEC_DIR, { common })
    let parent = gethVecs[0]
    for (let i = 1; i < gethVecs.length; i++) {
      const execute = gethVecs[i]
      it(`run geth vector: ${execute.blockNumber}`, async () => {
        await runBlock({ common, chain, rpc }, { parent, execute }, false)
        parent = execute
      })
    }
  }

  it(`reset TD`, () => {
    server.close()
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})

async function loadGethVectors(vectorsDirPath: string, opts: { common: Common }) {
  // set chain id to 1 for geth vectors
  opts.common._chainParams.chainId = BigInt(1)
  const stateDiffVec = JSON.parse(readFileSync(`${vectorsDirPath}/statediffs.json`))
  const executionWitness0 = {
    stateDiff: [],
    verkleProof: {
      commitmentsByPath: [],
      d: '0x',
      depthExtensionPresent: '0x',
      ipaProof: {
        cl: [],
        cr: [],
        finalEvaluation: '0x',
      },
      otherStems: [],
    },
  }

  const executionWitness1 = {
    stateDiff: stateDiffVec[0],
    verkleProof: {
      commitmentsByPath: [],
      d: '0x',
      depthExtensionPresent: '0x',
      ipaProof: {
        cl: [],
        cr: [],
        finalEvaluation: '0x',
      },
      otherStems: [],
    },
  }

  const executionWitness2 = {
    stateDiff: stateDiffVec[1],
    verkleProof: {
      commitmentsByPath: [],
      d: '0x',
      depthExtensionPresent: '0x',
      ipaProof: {
        cl: [],
        cr: [],
        finalEvaluation: '0x',
      },
      otherStems: [],
    },
  }
  const block0RlpHex = readFileSync(`${vectorsDirPath}/block0.rlp.hex`, 'utf8').trim()
  const block0 = Block.fromRLPSerializedBlock(hexToBytes(`0x${block0RlpHex}`), {
    ...opts,
    executionWitness: executionWitness0,
  })
  const _block0Payload = block0.toExecutionPayload()

  const block1RlpHex = readFileSync(`${vectorsDirPath}/block1.rlp.hex`, 'utf8').trim()
  const block1 = Block.fromRLPSerializedBlock(hexToBytes(`0x${block1RlpHex}`), {
    ...opts,
    executionWitness: executionWitness1,
  })
  const block1Payload = block1.toExecutionPayload()

  const block2RlpHex = readFileSync(`${vectorsDirPath}/block2.rlp.hex`, 'utf8').trim()
  const block2 = Block.fromRLPSerializedBlock(hexToBytes(`0x${block2RlpHex}`), {
    ...opts,
    executionWitness: executionWitness2,
  })
  const block2Payload = block2.toExecutionPayload()

  return [block1Payload, block2Payload]
}
