import { Block, BlockHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, bytesToPrefixedHexString, zeros } from '@ethereumjs/util'
import * as tape from 'tape'
import * as td from 'testdouble'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { blockToExecutionPayload } from '../../../lib/rpc/modules'
import blocks = require('../../testdata/blocks/beacon.json')
import genesisJSON = require('../../testdata/geth-genesis/post-merge.json')
import { baseRequest, baseSetup, params, setupChain } from '../helpers'
import { checkError } from '../util'

import { batchBlocks } from './newPayloadV1.spec'

const crypto = require('crypto')

const method = 'engine_forkchoiceUpdatedV1'

const originalValidate = BlockHeader.prototype._consensusFormatValidation

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

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Paris })

function createBlock(parentBlock: Block) {
  const prevRandao = crypto.randomBytes(32)
  const block = Block.fromBlockData(
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
    { common }
  )
  return block
}

export const validPayload = [validForkChoiceState, validPayloadAttributes]

tape(`${method}: call with invalid head block hash without 0x`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })
  const invalidForkChoiceState = {
    ...validForkChoiceState,
    headBlockHash: 'invalid formatted head block hash',
  }
  const req = params(method, [invalidForkChoiceState, validPayloadAttributes])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'headBlockHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const invalidForkChoiceState = {
    ...validForkChoiceState,
    finalizedBlockHash: '0xinvalid',
  }
  const req = params(method, [invalidForkChoiceState, validPayloadAttributes])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'finalizedBlockHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data but parent block is not loaded yet`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const nonExistentHeadBlockHash = {
    ...validForkChoiceState,
    headBlockHash: '0x1d93f244823f80efbd9292a0d0d72a2b03df8cd5a9688c6c3779d26a7cc5009c',
  }
  const req = params(method, [nonExistentHeadBlockHash, validPayloadAttributes])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'SYNCING')
    t.equal(res.body.result.payloadStatus.latestValidHash, null)
    t.equal(res.body.result.payloadStatus.validationError, null)
    t.equal(res.body.result.payloadId, null)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data and synced data`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const req = params(method, validPayload)
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
    t.equal(
      res.body.result.payloadStatus.latestValidHash,
      '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a'
    )
    t.equal(res.body.result.payloadStatus.validationError, null)
    t.notEqual(res.body.result.payloadId, null)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid timestamp payloadAttributes`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const invalidTimestampPayload: any = [{ ...validPayload[0] }, { ...validPayload[1] }]
  invalidTimestampPayload[1].timestamp = '0x0'

  const req = params(method, invalidTimestampPayload)
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid timestamp in payloadAttributes, got 0, need at least 1'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid fork choice state without payload attributes`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  const req = params(method, [validForkChoiceState])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
    t.equal(res.body.result.payloadStatus.latestValidHash, validForkChoiceState.headBlockHash)
    t.equal(res.body.result.payloadStatus.validationError, null)
    t.equal(res.body.result.payloadId, null)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: invalid terminal block with only genesis block`, async (t) => {
  const genesisWithHigherTtd = {
    ...genesisJSON,
    config: {
      ...genesisJSON.config,
      terminalTotalDifficulty: 17179869185,
    },
  }

  BlockHeader.prototype._consensusFormatValidation = td.func<any>()
  const { server } = await setupChain(genesisWithHigherTtd, 'post-merge', {
    engine: true,
  })

  const req = params(method, [validForkChoiceState, null])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'INVALID')
    t.equal(res.body.result.payloadStatus.latestValidHash, bytesToHex(zeros(32)))
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: invalid terminal block with 1+ blocks`, async (t) => {
  const genesisWithHigherTtd = {
    ...genesisJSON,
    config: {
      ...genesisJSON.config,
      terminalTotalDifficulty: 17179869185,
      clique: undefined,
      ethash: {},
    },
  }

  const { server, chain, common } = await setupChain(genesisWithHigherTtd, 'post-merge', {
    engine: true,
  })

  const newBlock = Block.fromBlockData(
    {
      header: {
        number: blocks[0].blockNumber,
        parentHash: blocks[0].parentHash,
        difficulty: 1,
        extraData: new Uint8Array(97),
      },
    },
    { common }
  )

  await chain.putBlocks([newBlock])
  const req = params(method, [
    { ...validForkChoiceState, headBlockHash: bytesToPrefixedHexString(newBlock.hash()) },
    null,
  ])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'INVALID')
    t.equal(res.body.result.payloadStatus.latestValidHash, bytesToHex(zeros(32)))
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with deep parent lookup`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  let req = params(method, [validForkChoiceState])
  let expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  for (let i = 0; i < 3; i++) {
    const req = params('engine_newPayloadV1', [blocks[i]])
    const expectRes = (res: any) => {
      t.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(t, server, req, 200, expectRes, false)
  }

  // Now set the head to the last hash
  req = params(method, [{ ...validForkChoiceState, headBlockHash: blocks[2].blockHash }])
  expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with deep parent lookup and with stored safe block hash`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  let req = params(method, [validForkChoiceState])
  let expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  await batchBlocks(t, server)

  req = params(method, [
    {
      ...validForkChoiceState,
      headBlockHash: blocks[2].blockHash,
      safeBlockHash: blocks[0].blockHash,
    },
  ])
  expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: unknown finalized block hash`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  const req = params(method, [
    {
      ...validForkChoiceState,
      finalizedBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4b',
    },
  ])
  const expectRes = checkError(t, INVALID_PARAMS, 'finalized block not available')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: invalid safe block hash`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  const req = params(method, [
    {
      ...validForkChoiceState,
      safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4b',
    },
  ])
  const expectRes = checkError(t, INVALID_PARAMS, 'safe block not available')

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: latest block after reorg`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  let req = params(method, [validForkChoiceState])
  let expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  await batchBlocks(t, server)

  req = params(method, [
    {
      ...validForkChoiceState,
      headBlockHash: blocks[2].blockHash,
      safeBlockHash: blocks[0].blockHash,
    },
  ])
  expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // check safe and finalized
  req = params('eth_getBlockByNumber', ['finalized', false])
  expectRes = (res: any) => {
    t.equal(res.body.result.number, '0x0', 'finalized should be set to genesis')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params('eth_getBlockByNumber', ['safe', false])
  expectRes = (res: any) => {
    t.equal(res.body.result.number, '0x1', 'safe should be set to first block')
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, [
    {
      headBlockHash: blocks[1].blockHash,
      safeBlockHash: blocks[2].blockHash,
      finalizedBlockHash: blocks[2].blockHash,
    },
  ])

  expectRes = (res: any) => {
    t.equal(res.body.error.code, -32602)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: validate safeBlockHash is part of canonical chain`, async (t) => {
  const { server, chain } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const genesis = await chain.getBlock(BigInt(0))

  // Build the payload for the canonical chain
  const canonical = [genesis]

  for (let i = 0; i < 2; i++) {
    canonical.push(createBlock(canonical[canonical.length - 1]))
  }

  // Build an alternative payload
  const reorg = [genesis]
  for (let i = 0; i < 2; i++) {
    reorg.push(createBlock(reorg[reorg.length - 1]))
  }

  const canonicalPayload = canonical.map(
    (e) => blockToExecutionPayload(e, BigInt(0)).executionPayload
  )
  const reorgPayload = reorg.map((e) => blockToExecutionPayload(e, BigInt(0)).executionPayload)

  await batchBlocks(t, server, canonicalPayload.slice(1))
  await batchBlocks(t, server, reorgPayload.slice(1))

  // Safe block hash is not in the canonical chain
  const req = params(method, [
    {
      headBlockHash: reorgPayload[2].blockHash,
      safeBlockHash: canonicalPayload[1].blockHash,
      finalizedBlockHash: reorgPayload[1].blockHash,
    },
  ])

  const expectRes = (res: any) => {
    t.equal(res.body.error.code, -32602)
    t.ok(res.body.error.message.includes('safeBlock'))
    t.ok(res.body.error.message.includes('canonical'))
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: validate finalizedBlockHash is part of canonical chain`, async (t) => {
  const { server, chain } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const genesis = await chain.getBlock(BigInt(0))

  // Build the payload for the canonical chain
  const canonical = [genesis]

  for (let i = 0; i < 2; i++) {
    canonical.push(createBlock(canonical[canonical.length - 1]))
  }

  // Build an alternative payload
  const reorg = [genesis]
  for (let i = 0; i < 2; i++) {
    reorg.push(createBlock(reorg[reorg.length - 1]))
  }

  const canonicalPayload = canonical.map(
    (e) => blockToExecutionPayload(e, BigInt(0)).executionPayload
  )
  const reorgPayload = reorg.map((e) => blockToExecutionPayload(e, BigInt(0)).executionPayload)

  await batchBlocks(t, server, canonicalPayload.slice(1))
  await batchBlocks(t, server, reorgPayload.slice(1))

  // Finalized block hash is not in the canonical chain
  const req = params(method, [
    {
      headBlockHash: reorgPayload[2].blockHash,
      safeBlockHash: reorgPayload[1].blockHash,
      finalizedBlockHash: canonicalPayload[1].blockHash,
    },
  ])

  const expectRes = (res: any) => {
    t.equal(res.body.error.code, -32602)
    t.ok(res.body.error.message.includes('finalizedBlock'))
    t.ok(res.body.error.message.includes('canonical'))
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape('reset TD', (t) => {
  td.reset()
  BlockHeader.prototype._consensusFormatValidation = originalValidate
  t.end()
})
