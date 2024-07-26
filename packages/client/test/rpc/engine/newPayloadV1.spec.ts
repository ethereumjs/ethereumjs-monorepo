import { BlockHeader } from '@ethereumjs/block'
import { create1559FeeMarketTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
  zeros,
} from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { baseSetup, batchBlocks, getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_newPayloadV1'

const [blockData] = blocks

describe(method, () => {
  it('call with invalid block hash without 0x', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const blockDataWithInvalidParentHash = [
      {
        ...blockData,
        parentHash: blockData.parentHash.slice(2),
      },
    ]

    const res = await rpc.request(method, blockDataWithInvalidParentHash)
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(
      res.error.message.includes(
        "invalid argument 0 for key 'parentHash': hex string without 0x prefix",
      ),
    )
  })

  it('call with invalid hex string as block hash', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const blockDataWithInvalidBlockHash = [{ ...blockData, blockHash: '0x-invalid-block-hash' }]
    const res = await rpc.request(method, blockDataWithInvalidBlockHash)
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(
      res.error.message.includes("invalid argument 0 for key 'blockHash': invalid block hash"),
    )
  })

  it('call with non existent block hash', async () => {
    const { server } = await setupChain(genesisJSON, 'merge', { engine: true })
    const rpc = getRpcClient(server)
    const blockDataNonExistentBlockHash = [
      {
        ...blockData,
        blockHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
      },
    ]
    const res = await rpc.request(method, blockDataNonExistentBlockHash)

    assert.equal(res.result.status, 'INVALID_BLOCK_HASH')
  })

  it('call with non existent parent hash', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    const blockDataNonExistentParentHash = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xf31969a769bfcdbcc1c05f2542fdc7aa9336fc1ea9a82c4925320c035095d649',
      },
    ]
    const res = await rpc.request(method, blockDataNonExistentParentHash)

    assert.equal(res.result.status, 'ACCEPTED')
  })

  it('call with unknown parent hash to store in remoteBlocks, then call valid ancestor in fcU', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    let res = await rpc.request(method, [blocks[1]])

    assert.equal(res.result.status, 'ACCEPTED')

    res = await rpc.request(method, [blocks[0]])

    assert.equal(res.result.status, 'VALID')

    // should return syncing as block1 would still not be executed
    const state = {
      headBlockHash: blocks[1].blockHash,
      safeBlockHash: blocks[1].blockHash,
      finalizedBlockHash: blocks[0].blockHash,
    }
    res = await rpc.request('engine_forkchoiceUpdatedV1', [state])

    assert.equal(res.result.payloadStatus.status, 'SYNCING')

    // now block2 should be executed
    res = await rpc.request(method, [blocks[1]])

    assert.equal(res.result.status, 'VALID')
  })

  it('invalid terminal block', async () => {
    const genesisWithHigherTtd = {
      ...genesisJSON,
      config: {
        ...genesisJSON.config,
        terminalTotalDifficulty: 17179869185,
      },
    }

    BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()
    vi.doMock('@ethereumjs/block', () => BlockHeader)

    const { server } = await setupChain(genesisWithHigherTtd, 'post-merge', {
      engine: true,
    })
    const rpc = getRpcClient(server)
    const res = await rpc.request(method, [blockData, null])

    assert.equal(res.result.status, 'INVALID')
    assert.equal(res.result.latestValidHash, bytesToHex(zeros(32)))
  })

  it('call with valid data', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    const res = await rpc.request(method, [blockData])

    assert.equal(res.result.status, 'VALID')
    assert.equal(res.result.latestValidHash, blockData.blockHash)
  })

  it('call with valid data but invalid transactions', async () => {
    const { chain, server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    chain.config.logger.silent = true
    const blockDataWithInvalidTransaction = {
      ...blockData,
      transactions: ['0x1'],
    }

    const res = await rpc.request(method, [blockDataWithInvalidTransaction])
    assert.equal(res.result.status, 'INVALID')
    assert.equal(res.result.latestValidHash, blockData.parentHash)
    const expectedError = 'Invalid tx at index 0: Error: Invalid serialized tx input: must be array'
    assert.ok(
      res.result.validationError.includes(expectedError),
      `should error with - ${expectedError}`,
    )
  })

  it('call with valid data & valid transaction but not signed', async () => {
    const { server, common, chain } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    chain.config.logger.silent = true

    // Let's mock a non-signed transaction so execution fails
    const tx = create1559FeeMarketTx(
      {
        gasLimit: 21_000,
        maxFeePerGas: 10,
        value: 1,
        to: createAddressFromString('0x61FfE691821291D02E9Ba5D33098ADcee71a3a17'),
      },
      { common },
    )

    const transactions = [bytesToHex(tx.serialize())]
    const blockDataWithValidTransaction = {
      ...blockData,
      transactions,
      blockHash: '0x308f490332a31fade8b2b46a8e1132cd15adeaffbb651cb523c067b3f007dd9e',
    }

    const res = await rpc.request(method, [blockDataWithValidTransaction])

    assert.equal(res.result.status, 'INVALID')
    assert.isTrue(res.result.validationError.includes('transaction at index 0 is unsigned'))
  })

  it('call with valid data & valid transaction', async () => {
    const accountPk = hexToBytes(
      '0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    )
    const accountAddress = createAddressFromPrivateKey(accountPk)
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
    const rpc = getRpcClient(server)
    const tx = create1559FeeMarketTx(
      {
        maxFeePerGas: '0x7',
        value: 6,
        gasLimit: 53_000,
      },
      { common },
    ).sign(accountPk)
    const transactions = [bytesToHex(tx.serialize())]
    const blockDataWithValidTransaction = {
      ...blockData,
      transactions,
      parentHash: '0xefc1993f08864165c42195966b3f12794a1a42afa84b1047a46ab6b105828c5c',
      receiptsRoot: '0xc508745f9f8b6847a127bbc58b7c6b2c0f073c7ca778b6f020138f0d6d782adf',
      gasUsed: '0xcf08',
      stateRoot: '0x5a7123ab8bdd4f172438671a2a3de143f2105aa1ac3338c97e5f433e8e380d8d',
      blockHash: '0x625f2fd36bf278f92211376cbfe5acd7ac5da694e28f3d94d59488b7dbe213a4',
    }

    const res = await rpc.request(method, [blockDataWithValidTransaction])
    assert.equal(res.result.status, 'VALID')
  })

  it('call with too many transactions', async () => {
    const accountPk = hexToBytes(
      '0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    )
    const accountAddress = createAddressFromPrivateKey(accountPk)
    const newGenesisJSON = {
      ...genesisJSON,
      alloc: {
        ...genesisJSON.alloc,
        [accountAddress.toString()]: {
          balance: '0x100000000',
        },
      },
    }

    const { chain, server, common } = await setupChain(newGenesisJSON, 'post-merge', {
      engine: true,
    })
    const rpc = getRpcClient(server)
    const transactions = Array.from({ length: 101 }, (_v, i) => {
      const tx = create1559FeeMarketTx(
        {
          nonce: i,
          maxFeePerGas: '0x7',
          value: 6,
          gasLimit: 53_000,
        },
        { common },
      ).sign(accountPk)

      return bytesToHex(tx.serialize())
    })
    const blockDataWithValidTransaction = {
      ...blockData,
      transactions,
      parentHash: '0x7444bd276e83a1ad90cf2ce8d1cff9ad15ed2489e49928a802bd60e3e81010f4',
      receiptsRoot: '0x29651db7ce551aae097d75c4c9785e55068a11cf9e365bbe1c3b1780a85621c0',
      gasUsed: '0x51ae28',
      stateRoot: '0xd51a194147c26671af9ce46e9f5914d3e64fac15e80e46be5cc8c42c935449bc',
      blockHash: '0x7c5cc6138adca74b80e6066c30e330b6307ff43bc0dc3dd4e988bb1b9764d199',
    }

    // set the newpayload limit to 100 for test
    ;(chain.config as any).engineNewpayloadMaxTxsExecute = 100

    // newpayload shouldn't execute block but just return either SYNCING or ACCEPTED

    let res = await rpc.request(method, [blockDataWithValidTransaction])
    assert.equal(res.result.status, 'SYNCING')

    // set the newpayload limit to 101 and the block should be executed
    ;(chain.config as any).engineNewpayloadMaxTxsExecute = 101

    res = await rpc.request(method, [blockDataWithValidTransaction])
    assert.equal(res.result.status, 'VALID')
  })

  it('re-execute payload and verify that no errors occur', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    await batchBlocks(rpc, blocks)

    let res = await rpc.request('engine_forkchoiceUpdatedV1', [
      {
        headBlockHash: blocks[2].blockHash,
        finalizedBlockHash: blocks[2].blockHash,
        safeBlockHash: blocks[2].blockHash,
      },
    ])

    // Let's set new head hash
    assert.equal(res.result.payloadStatus.status, 'VALID')

    // Now let's try to re-execute payload
    res = await rpc.request(method, [blockData])

    assert.equal(res.result.status, 'VALID')
  })

  it('parent hash equals to block hash', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })
    const blockDataHasBlockHashSameAsParentHash = [
      {
        ...blockData,
        blockHash: blockData.parentHash,
      },
    ]
    const rpc = getRpcClient(server)
    const res = await rpc.request(method, blockDataHasBlockHashSameAsParentHash)

    assert.equal(res.result.status, 'INVALID_BLOCK_HASH')
  })
})
