import { readFileSync } from 'fs'
import {
  BlockHeader,
  createBlockFromExecutionPayload,
  createBlockFromRLP,
  executionPayloadFromBeaconPayload,
} from '@ethereumjs/block'
import { hexToBytes } from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle.js'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { kaustinen4Data } from '../../testdata/blocks/kaustinen4.ts'
import { kaustinen6Data } from '../../testdata/geth-genesis/kaustinen6.ts'
import { getRPCClient, setupChain } from '../helpers.ts'

import type { BeaconPayloadJSON } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { VerkleCrypto, VerkleExecutionWitness } from '@ethereumjs/util'
import type { HttpClient } from 'jayson/promise/index.js'
import type { Chain } from '../../../src/blockchain/index.ts'
const genesisVerkleStateRoot = '0x1fbf85345a3cbba9a6d44f991b721e55620a22397c2a93ee8d5011136ac300ee'
const genesisVerkleBlockHash = '0x3fe165c03e7a77d1e3759362ebeeb16fd964cb411ce11fbe35c7032fab5b9a8a'

/**
 * One can run this test in this format:
 *   1. Directly pull slots from a kaustinen beacon url
 *     `TEST_ONLINE_SLOTS=15 PEER_BEACON_URL=https://beacon.verkle-gen-devnet-6.ethpandaops.io DEBUG=ethjs,vm:*,evm:*,statemanager:verkle* npx vitest run test/rpc/engine/kaustinen6.spec.ts`
 *
 * However there are other ways to run the test with save data and testvectors but they are from old versions but
 * can be updated to make it work
 *
 *   a. On the saved blocks, comma separated (were produced for kaustinen4 )
 *      `TEST_SAVED_NUMBERS=353,368,374,467 npx vitest run test/rpc/engine/kaustinen5.spec.ts`
 *   b. Geth produced testvectors (were produced for kaustinen5)
 *     `TEST_GETH_VEC_DIR=test/testdata/gethk5vecs DEBUG=ethjs,vm:*,evm:*,statemanager:verkle* npx vitest run test/rpc/engine/kaustinen6.spec.ts` // cspell:disable-line
 */

const originalValidate = BlockHeader.prototype['_consensusFormatValidation']

async function fetchExecutionPayload(
  peerBeaconUrl: string,
  slot: number | string,
): Promise<BeaconPayloadJSON | undefined> {
  let beaconPayload: BeaconPayloadJSON | undefined = undefined
  try {
    const beaconBlock = await (await fetch(`${peerBeaconUrl}/eth/v2/beacon/blocks/${slot}`)).json()
    beaconPayload = beaconBlock.data.message.body.execution_payload
    // eslint-disable-next-line no-empty
  } catch {}

  return beaconPayload
}

async function runBlock(
  { chain, rpc, common }: { chain: Chain; rpc: HttpClient; common: Common },
  { execute, parent }: { execute: any; parent: any },
  isBeaconData: boolean,
  context: any,
) {
  const blockCache = chain.blockCache

  const parentPayload = isBeaconData === true ? executionPayloadFromBeaconPayload(parent) : parent
  const parentBlock = await createBlockFromExecutionPayload(parentPayload, {
    common,
  })
  blockCache.remoteBlocks.set(parentPayload.blockHash.slice(2), parentBlock)
  blockCache.executedBlocks.set(parentPayload.blockHash.slice(2), parentBlock)

  const executePayload =
    isBeaconData === true ? executionPayloadFromBeaconPayload(execute) : execute
  const res = await rpc.request('engine_newPayloadV2', [executePayload])

  // if the block was not executed mark as skip so it shows in test
  if (res.result.status === 'ACCEPTED') {
    context.skip()
  }
  assert.strictEqual(res.result.status, 'VALID', 'valid status should be received')
}

describe.skip(`valid verkle network setup`, async () => {
  const { server, chain, common } = await setupChain(kaustinen6Data, 'post-merge', {
    engine: true,
    genesisStateRoot: hexToBytes(genesisVerkleStateRoot),
    customCrypto: { verkle: verkle as unknown as VerkleCrypto },
    statelessVerkle: true,
  })
  const rpc = getRPCClient(server)
  it('genesis should be correctly setup', async () => {
    const res = await rpc.request('eth_getBlockByNumber', ['0x0', false])

    const block0 = res.result
    assert.strictEqual(block0.hash, genesisVerkleBlockHash)
    assert.strictEqual(block0.stateRoot, genesisVerkleStateRoot)
  })

  // currently it seems the the blocks can't be played one after another as it seems
  // to not do clean init of the statemanager. this isn't a problem in sequential
  // execution, but need to be fixed up in the stateless random execution
  // TEST_SAVED_NUMBERS=353,368,374,479
  const savedTestCases = process.env.TEST_SAVED_NUMBERS?.split(',') ?? []

  for (const testCase of savedTestCases) {
    it(`run saved block ${testCase}`, async (context) => {
      let testData
      let isBeaconData
      if (process.env.SAVED_DATA_DIR !== undefined) {
        const fileName = `${process.env.SAVED_DATA_DIR}/${testCase}.json`
        testData = JSON.parse(readFileSync(fileName, 'utf8'))[testCase]
        isBeaconData = false
      } else {
        testData = kaustinen4Data[testCase as keyof typeof kaustinen4Data]
        isBeaconData = true
      }
      if (testData === undefined) {
        throw Error('unavailable data')
      }
      await runBlock({ common, chain, rpc }, testData, isBeaconData, context)
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
      if (execute === undefined) {
        // may be there was no block on this slot
        continue
      }

      it(`run fetched block slot: ${i} number: ${execute.block_number}`, async (context) => {
        try {
          await runBlock({ common, chain, rpc }, { parent, execute }, true, context)
        } finally {
          parent = execute
        }
      })
    }
  }

  if (process.env.TEST_GETH_VEC_DIR !== undefined) {
    const gethVectors = await loadGethVectors(process.env.TEST_GETH_VEC_DIR, {
      common,
    })
    let parent = gethVectors[0]
    for (let i = 1; i < gethVectors.length; i++) {
      const execute = gethVectors[i]
      it(`run geth vector: ${execute.blockNumber}`, async (context) => {
        await runBlock({ common, chain, rpc }, { parent, execute }, false, context)
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
  opts.common['_chainParams'].chainId = 1
  const stateDiffVec = JSON.parse(readFileSync(`${vectorsDirPath}/statediffs.json`, 'utf8'))
  const executionWitness0: VerkleExecutionWitness = {
    parentStateRoot: '0x',
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

  const executionWitness1: VerkleExecutionWitness = {
    parentStateRoot: '0x',
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

  const executionWitness2: VerkleExecutionWitness = {
    parentStateRoot: '0x',
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
  const block0 = createBlockFromRLP(hexToBytes(`0x${block0RlpHex}`), {
    ...opts,
    executionWitness: executionWitness0,
  })
  const _block0Payload = block0.toExecutionPayload()

  const block1RlpHex = readFileSync(`${vectorsDirPath}/block1.rlp.hex`, 'utf8').trim()
  const block1 = createBlockFromRLP(hexToBytes(`0x${block1RlpHex}`), {
    ...opts,
    executionWitness: executionWitness1,
  })
  const block1Payload = block1.toExecutionPayload()

  const block2RlpHex = readFileSync(`${vectorsDirPath}/block2.rlp.hex`, 'utf8').trim()
  const block2 = createBlockFromRLP(hexToBytes(`0x${block2RlpHex}`), {
    ...opts,
    executionWitness: executionWitness2,
  })
  const block2Payload = block2.toExecutionPayload()

  return [block1Payload, block2Payload]
}
