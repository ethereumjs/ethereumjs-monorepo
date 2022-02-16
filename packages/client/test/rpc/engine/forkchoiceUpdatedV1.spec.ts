import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup } from '../helpers'
import { checkError } from '../util'
import { parseCustomParams, parseGenesisState } from '../../../lib/util'
import Common from '@ethereumjs/common'
import Blockchain from '@ethereumjs/blockchain'

const method = 'engine_forkchoiceUpdatedV1'

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, [
    {
      headBlockHash: 'b084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      safeBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      finalizedBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
    },
    {
      payloadAttributes: null,
    },
  ])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'headBlockHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const req = params(method, [
    {
      headBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      safeBlockHash: '0xb084c10440f05f5a23a55d1d7ebcb1b3892935fb56f23cdc9a7f42c348eed174',
      finalizedBlockHash: '0xinvalid',
    },
    {
      payloadAttributes: null,
    },
  ])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'finalizedBlockHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape.only(`${method}: call with valid data`, async (t) => {
  const genesis = {
    config: {
      chainId: 1,
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      muirGlacierBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      clique: {
        period: 5,
        epoch: 30000,
      },
      terminalTotalDifficulty: 0,
    },
    nonce: '0x42',
    timestamp: '0x0',
    extraData:
      '0x0000000000000000000000000000000000000000000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x1C9C380',
    difficulty: '0x400000000',
    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    coinbase: '0x0000000000000000000000000000000000000000',
    alloc: {
      '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b': { balance: '0x6d6172697573766477000000' },
    },
    number: '0x0',
    gasUsed: '0x0',
    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    baseFeePerGas: '0x7',
  }

  const genesisParams = await parseCustomParams(genesis, 'the-merge')
  const genesisState = await parseGenesisState(genesis)

  const common = new Common({
    chain: genesisParams.name,
    customChains: [[genesisParams, genesisState]],
  })
  const blockchain = await Blockchain.create({
    common,
    validateBlocks: true,
    validateConsensus: true,
  })
  const { server, client } = baseSetup({
    engine: true,
    includeVM: true,
    commonChain: common,
    blockchain,
  })

  await client.chain.update()
  const payload = [
    {
      headBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
      safeBlockHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
      finalizedBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      timestamp: '0x5',
      random: '0x0000000000000000000000000000000000000000000000000000000000000000',
      suggestedFeeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    },
  ]
  const req = params(method, payload)
  const expectRes = (res: any) => {
    console.log(res)
    t.equal(res.body.result.status, 'VALID')
  }
  await baseRequest(t, server, req, 200, expectRes)
})
