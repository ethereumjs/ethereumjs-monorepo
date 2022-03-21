import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { params, baseRequest, baseSetup, setupChain } from '../helpers'
import { checkError } from '../util'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address } from 'ethereumjs-util'

const method = 'engine_newPayloadV1'

const blockData = {
  parentHash: '0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a',
  feeRecipient: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
  stateRoot: '0xca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
  blockNumber: '0x1',
  gasLimit: '0x1c9c380',
  gasUsed: '0x0',
  timestamp: '0x5',
  extraData: '0x',
  baseFeePerGas: '0x7',
  blockHash: '0x3559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
  transactions: [],
}

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const blockDataWithInvalidParentHash = [
    {
      ...blockData,
      parentHash: blockData.parentHash.slice(2),
    },
  ]

  const req = params(method, blockDataWithInvalidParentHash)
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'parentHash': hex string without 0x prefix"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup({ engine: true, includeVM: true })

  const blockDataWithInvalidBlockHash = [{ ...blockData, blockHash: '0x-invalid-block-hash' }]
  const req = params(method, blockDataWithInvalidBlockHash)
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    "invalid argument 0 for key 'blockHash': invalid block hash"
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with non existent block hash`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'merge', { engine: true })

  const blockDataNonExistentBlockHash = [
    {
      ...blockData,
      blockHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
    },
  ]
  const req = params(method, blockDataNonExistentBlockHash)
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'INVALID_BLOCK_HASH')
  }

  await baseRequest(t, server, req, 200, expectRes)
})

// TODO(cbrzn): Change this to expect ACCEPTED when optimistic sync is supported
tape(`${method}: call with non existent parent hash`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const blockDataNonExistentParentHash = [
    {
      ...blockData,
      parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
    },
  ]
  const req = params(method, blockDataNonExistentParentHash)
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'SYNCING')
  }

  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: invalid terminal block`, async (t) => {
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

  const req = params(method, [blockData, null])
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'INVALID_TERMINAL_BLOCK')
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data`, async (t) => {
  const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

  const req = params(method, [blockData])
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'VALID')
    t.equal(res.body.result.latestValidHash, blockData.blockHash)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data but invalid transactions`, async (t) => {
  const { chain, server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  chain.config.logger.silent = true
  const blockDataWithInvalidTransaction = {
    ...blockData,
    transactions: ['0x1'],
  }
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'INVALID')
    t.equal(res.body.result.latestValidHash, blockData.parentHash)
    t.equal(
      res.body.result.validationError,
      `Invalid tx at index 0: Error: Invalid serialized tx input: must be array`
    )
  }

  const req = params(method, [blockDataWithInvalidTransaction])
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data & valid transaction but not signed`, async (t) => {
  const { server, common, chain } = await setupChain(genesisJSON, 'post-merge', { engine: true })
  chain.config.logger.silent = true

  // Let's mock a non-signed transaction so execution fails
  const tx = FeeMarketEIP1559Transaction.fromTxData(
    {
      gasLimit: 21_000,
      maxFeePerGas: 10,
      value: 1,
      to: Address.fromString('0x61FfE691821291D02E9Ba5D33098ADcee71a3a17'),
    },
    { common }
  )

  const transactions = ['0x' + tx.serialize().toString('hex')]
  const blockDataWithValidTransaction = {
    ...blockData,
    transactions,
    blockHash: '0x308f490332a31fade8b2b46a8e1132cd15adeaffbb651cb523c067b3f007dd9e',
  }
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'INVALID')
    t.true(res.body.result.validationError.includes('Error verifying block while running:'))
  }

  const req = params(method, [blockDataWithValidTransaction])
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid data & valid transaction`, async (t) => {
  const accountPk = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )
  const accountAddress = Address.fromPrivateKey(accountPk)
  const newGenesisJSON = {
    ...genesisJSON,
    alloc: {
      ...genesisJSON.alloc,
      [accountAddress.toString()]: {
        balance: '0x1000000',
      },
    },
  }

  const { server, common } = await setupChain(newGenesisJSON, 'post-merge', { engine: true })

  const tx = FeeMarketEIP1559Transaction.fromTxData(
    {
      maxFeePerGas: '0x7',
      value: 6,
      gasLimit: 53_000,
    },
    { common }
  ).sign(accountPk)
  const transactions = ['0x' + tx.serialize().toString('hex')]
  const blockDataWithValidTransaction = {
    ...blockData,
    transactions,
    parentHash: '0xefc1993f08864165c42195966b3f12794a1a42afa84b1047a46ab6b105828c5c',
    receiptsRoot: '0xc508745f9f8b6847a127bbc58b7c6b2c0f073c7ca778b6f020138f0d6d782adf',
    gasUsed: '0xcf08',
    stateRoot: '0x5a7123ab8bdd4f172438671a2a3de143f2105aa1ac3338c97e5f433e8e380d8d',
    blockHash: '0x625f2fd36bf278f92211376cbfe5acd7ac5da694e28f3d94d59488b7dbe213a4',
  }
  const expectRes = (res: any) => {
    t.equal(res.body.result.status, 'VALID')
  }
  const req = params(method, [blockDataWithValidTransaction])
  await baseRequest(t, server, req, 200, expectRes)
})
