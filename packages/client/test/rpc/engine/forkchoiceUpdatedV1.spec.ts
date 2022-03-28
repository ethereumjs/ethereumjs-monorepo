import tape from 'tape'
import { Block } from '@ethereumjs/block'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup, setupChain } from '../helpers'
import { checkError } from '../util'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'

const method = 'engine_forkchoiceUpdatedV1'

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

export const validPayload = [validForkChoiceState, validPayloadAttributes]

const blocks = [
  {
    blockNumber: '0x1',
    parentHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
    feeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x1c9c380',
    gasUsed: '0x0',
    timestamp: '0x5',
    extraData: '0x',
    baseFeePerGas: '0x7',
    blockHash: '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
    prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
    transactions: [],
  },
  {
    blockNumber: '0x2',
    parentHash: '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
    feeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x1c9c380',
    gasUsed: '0x0',
    timestamp: '0xa',
    extraData: '0x',
    baseFeePerGas: '0x7',
    blockHash: '0x3a7d770fb8b9c9b6b9511d5d8656e852a845f779f4f80ad5bb9e9db56f39e47e',
    prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
    transactions: [],
  },
  {
    blockNumber: '0x3',
    parentHash: '0x3a7d770fb8b9c9b6b9511d5d8656e852a845f779f4f80ad5bb9e9db56f39e47e',
    feeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    logsBloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x1c9c380',
    gasUsed: '0x0',
    timestamp: '0xf',
    extraData: '0x',
    baseFeePerGas: '0x7',
    blockHash: '0x3af2006a7de12988201ef813f7e4decd24f1f74acd1a7a5efa2a3cd3a24063fe',
    prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
    transactions: [],
  },
]

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
    t.equal(res.body.result.payloadStatus.latestValidHash, validForkChoiceState.headBlockHash)
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
    t.equal(res.body.result.payloadStatus.latestValidHash, null)
    t.equal(res.body.result.payloadStatus.validationError, null)
    t.notEqual(res.body.result.payloadId, null)
  }
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

  const { server } = await setupChain(genesisWithHigherTtd, 'post-merge', {
    engine: true,
  })

  const req = params(method, [validForkChoiceState, null])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'INVALID_TERMINAL_BLOCK')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: invalid terminal block with 1+ blocks`, async (t) => {
  const genesisWithHigherTtd = {
    ...genesisJSON,
    config: {
      ...genesisJSON.config,
      terminalTotalDifficulty: 17179869185,
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
      },
    },
    { common }
  )

  await chain.putBlocks([newBlock])
  const req = params(method, [
    { ...validForkChoiceState, headBlockHash: '0x' + newBlock.hash().toString('hex') },
    null,
  ])
  const expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.status, 'INVALID_TERMINAL_BLOCK')
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

  for (let i = 0; i < 3; i++) {
    const req = params('engine_newPayloadV1', [blocks[i]])
    const expectRes = (res: any) => {
      t.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(t, server, req, 200, expectRes, false)
  }

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
  const expectRes = checkError(t, INVALID_PARAMS, 'finalized block hash not available')
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
  const expectRes = checkError(t, INVALID_PARAMS, 'safe block hash not available')

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: latest block after reorg`, async (t) => {
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

  req = params(method, [
    {
      headBlockHash: blocks[1].blockHash,
      safeBlockHash: blocks[2].blockHash,
      finalizedBlockHash: blocks[2].blockHash,
    },
  ])

  expectRes = (res: any) => {
    t.equal(res.body.result.payloadStatus.latestValidHash, blocks[1].blockHash)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
