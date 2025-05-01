import { BlockHeader, createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { postMergeGethGenesis } from '@ethereumjs/testdata'
import { bytesToHex, randomBytes } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { INVALID_FORKCHOICE_STATE, INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { blockToExecutionPayload } from '../../../src/rpc/modules/index.ts'
import { beaconData } from '../../testdata/blocks/beacon.ts'
import { baseSetup, batchBlocks, getRPCClient, setupChain } from '../helpers.ts'

import type { Block } from '@ethereumjs/block'

const method = 'engine_forkchoiceUpdatedV1'

BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()

const validForkChoiceState = {
  headBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  finalizedBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
}

const validPayloadAttributes = {
  timestamp: '0x5',
  prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
}

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Paris })

function createBlockFromParent(parentBlock: Block) {
  const prevRandao = randomBytes(32)
  const block = createBlock(
    {
      header: {
        parentHash: parentBlock.hash(),
        mixHash: prevRandao,
        number: parentBlock.header.number + BigInt(1),
        stateRoot: parentBlock.header.stateRoot,
        timestamp: parentBlock.header.timestamp + BigInt(1),
        gasLimit: parentBlock.header.gasLimit,
      },
    },
    { common },
  )
  return block
}

const validPayload = [validForkChoiceState, validPayloadAttributes]

describe(method, () => {
  it('call with invalid head block hash without 0x', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })
    const invalidForkChoiceState = {
      ...validForkChoiceState,
      headBlockHash: 'invalid formatted head block hash',
    }
    const res = await rpc.request(method, [invalidForkChoiceState, validPayloadAttributes])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(
      res.error.message.includes(
        "invalid argument 0 for key 'headBlockHash': hex string without 0x prefix",
      ),
    )
  })

  it('call with invalid hex string as block hash', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const invalidForkChoiceState = {
      ...validForkChoiceState,
      finalizedBlockHash: '0xinvalid', // cspell:disable-line
    }
    const res = await rpc.request(method, [invalidForkChoiceState, validPayloadAttributes])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(
      res.error.message.includes(
        "invalid argument 0 for key 'finalizedBlockHash': invalid block hash",
      ),
    )
  })

  it('call with valid data but parent block is not loaded yet', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const nonExistentHeadBlockHash = {
      ...validForkChoiceState,
      headBlockHash: '0x1d93f244823f80efbd9292a0d0d72a2b03df8cd5a9688c6c3779d26a7cc5009c',
    }
    const res = await rpc.request(method, [nonExistentHeadBlockHash, validPayloadAttributes])

    assert.strictEqual(res.result.payloadStatus.status, 'SYNCING')
    assert.strictEqual(res.result.payloadStatus.latestValidHash, null)
    assert.strictEqual(res.result.payloadStatus.validationError, null)
    assert.strictEqual(res.result.payloadId, null)
  })

  it('call with valid data and synced data', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, validPayload)
    assert.strictEqual(res.result.payloadStatus.status, 'VALID')
    assert.strictEqual(
      res.result.payloadStatus.latestValidHash,
      '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
    )
    assert.strictEqual(res.result.payloadStatus.validationError, null)
    assert.notEqual(res.result.payloadId, null)
  })

  it('call with invalid timestamp payloadAttributes', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const invalidTimestampPayload = [
      { ...validPayload[0] },
      { ...validPayload[1], timestamp: '0x0' },
    ]

    const res = await rpc.request(method, invalidTimestampPayload)
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(
      res.error.message.includes('invalid timestamp in payloadAttributes, got 0, need at least 1'),
    )
  })

  it('call with valid fork choice state without payload attributes', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [validForkChoiceState])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')
    assert.strictEqual(res.result.payloadStatus.latestValidHash, validForkChoiceState.headBlockHash)
    assert.strictEqual(res.result.payloadStatus.validationError, null)
    assert.strictEqual(res.result.payloadId, null)
  })

  it('call with deep parent lookup', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    let res = await rpc.request(method, [validForkChoiceState])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')

    for (let i = 0; i < 3; i++) {
      const res = await rpc.request('engine_newPayloadV1', [beaconData[i]])
      assert.strictEqual(res.result.status, 'VALID')
    }

    // Now set the head to the last hash
    res = await rpc.request(method, [
      { ...validForkChoiceState, headBlockHash: beaconData[2].blockHash },
    ])
    assert.strictEqual(res.result.payloadStatus.status, 'VALID')
  })

  it('call with deep parent lookup and with stored safe block hash', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    let res = await rpc.request(method, [validForkChoiceState])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')

    await batchBlocks(rpc, beaconData)

    res = await rpc.request(method, [
      {
        ...validForkChoiceState,
        headBlockHash: beaconData[2].blockHash,
        safeBlockHash: beaconData[0].blockHash,
      },
    ])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')
  })

  it('unknown finalized block hash', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [
      {
        ...validForkChoiceState,
        finalizedBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4b',
      },
    ])
    assert.strictEqual(res.error.code, INVALID_FORKCHOICE_STATE)
    assert.isTrue(res.error.message.includes('finalized block not available in canonical chain'))
  })

  it('invalid safe block hash', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [
      {
        ...validForkChoiceState,
        safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4b',
      },
    ])
    assert.strictEqual(res.error.code, INVALID_FORKCHOICE_STATE)
    assert.isTrue(res.error.message.includes('safe block not available'))
  })

  it('latest block after reorg', async () => {
    const { server, blockchain } = await setupChain(postMergeGethGenesis, 'post-merge', {
      engine: true,
    })
    const rpc = getRPCClient(server)
    let res = await rpc.request(method, [validForkChoiceState])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')

    await batchBlocks(rpc, beaconData)

    res = await rpc.request(method, [
      {
        ...validForkChoiceState,
        headBlockHash: beaconData[2].blockHash,
        safeBlockHash: beaconData[0].blockHash,
        finalizedBlockHash: bytesToHex(blockchain.genesisBlock.hash()),
      },
    ])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')

    // check safe and finalized
    res = await rpc.request('eth_getBlockByNumber', ['finalized', false])

    assert.strictEqual(res.result.number, '0x0', 'finalized should be set to genesis')

    res = await rpc.request('eth_getBlockByNumber', ['safe', false])

    assert.strictEqual(res.result.number, '0x1', 'safe should be set to first block')

    res = await rpc.request(method, [
      {
        headBlockHash: beaconData[1].blockHash,
        safeBlockHash: beaconData[2].blockHash,
        finalizedBlockHash: beaconData[2].blockHash,
      },
    ])

    assert.strictEqual(res.error.code, -32602)
  })

  it('validate safeBlockHash is part of canonical chain', async () => {
    const { server, chain } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const genesis = await chain.getBlock(BigInt(0))

    // Build the payload for the canonical chain
    const canonical = [genesis]

    for (let i = 0; i < 2; i++) {
      canonical.push(createBlockFromParent(canonical[canonical.length - 1]))
    }

    // Build an alternative payload
    const reorg = [genesis]
    for (let i = 0; i < 2; i++) {
      reorg.push(createBlockFromParent(reorg[reorg.length - 1]))
    }

    const canonicalPayload = canonical.map(
      (e) => blockToExecutionPayload(e, BigInt(0)).executionPayload,
    )
    const reorgPayload = reorg.map((e) => blockToExecutionPayload(e, BigInt(0)).executionPayload)

    await batchBlocks(rpc, canonicalPayload.slice(1))
    await batchBlocks(rpc, reorgPayload.slice(1))

    // Safe block hash is not in the canonical chain
    const res = await rpc.request(method, [
      {
        headBlockHash: reorgPayload[2].blockHash,
        safeBlockHash: canonicalPayload[1].blockHash,
        finalizedBlockHash: reorgPayload[1].blockHash,
      },
    ])

    assert.strictEqual(res.error.code, INVALID_FORKCHOICE_STATE)
    assert.isTrue(res.error.message.includes('safe'))
    assert.isTrue(res.error.message.includes('canonical'))
  })

  it('validate finalizedBlockHash is part of canonical chain', async () => {
    const { server, chain } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const genesis = await chain.getBlock(BigInt(0))

    // Build the payload for the canonical chain
    const canonical = [genesis]

    for (let i = 0; i < 2; i++) {
      canonical.push(createBlockFromParent(canonical[canonical.length - 1]))
    }

    // Build an alternative payload
    const reorg = [genesis]
    for (let i = 0; i < 2; i++) {
      reorg.push(createBlockFromParent(reorg[reorg.length - 1]))
    }

    const canonicalPayload = canonical.map(
      (e) => blockToExecutionPayload(e, BigInt(0)).executionPayload,
    )
    const reorgPayload = reorg.map((e) => blockToExecutionPayload(e, BigInt(0)).executionPayload)

    await batchBlocks(rpc, canonicalPayload.slice(1))
    await batchBlocks(rpc, reorgPayload.slice(1))

    // Finalized block hash is not in the canonical chain
    const res = await rpc.request(method, [
      {
        headBlockHash: reorgPayload[2].blockHash,
        safeBlockHash: reorgPayload[1].blockHash,
        finalizedBlockHash: canonicalPayload[1].blockHash,
      },
    ])

    assert.strictEqual(res.error.code, INVALID_FORKCHOICE_STATE)
    assert.isTrue(res.error.message.includes('finalized'))
    assert.isTrue(res.error.message.includes('canonical'))
  })
})
