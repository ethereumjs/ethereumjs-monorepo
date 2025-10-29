import { SIGNER_G, postMergeGethGenesis } from '@ethereumjs/testdata'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { bytesToHex, createAddressFromString } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.ts'
import { beaconData } from '../../testdata/blocks/beacon.ts'
import { baseSetup, batchBlocks, getRPCClient, setupChain } from '../helpers.ts'

const method = 'engine_newPayloadV2'

const [blockData] = beaconData

describe(`${method}: call with executionPayloadV1`, () => {
  it('call with invalid block hash without 0x', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const blockDataWithInvalidParentHash = [
      {
        ...blockData,
        parentHash: blockData.parentHash.slice(2),
      },
    ]

    const res = await rpc.request(method, blockDataWithInvalidParentHash)
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(
      res.error.message.includes(
        "invalid argument 0 for key 'parentHash': hex string without 0x prefix",
      ),
    )
  })

  it('call with invalid hex string as block hash', async () => {
    const { rpc } = await baseSetup({ engine: true, includeVM: true })

    const blockDataWithInvalidBlockHash = [{ ...blockData, blockHash: '0x-invalid-block-hash' }]
    const res = await rpc.request(method, blockDataWithInvalidBlockHash)
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(
      res.error.message.includes("invalid argument 0 for key 'blockHash': invalid block hash"),
    )
  })

  it('call with non existent block hash', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'merge', { engine: true })
    const rpc = getRPCClient(server)
    const blockDataNonExistentBlockHash = [
      {
        ...blockData,
        blockHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
      },
    ]
    const res = await rpc.request(method, blockDataNonExistentBlockHash)

    assert.strictEqual(res.result.status, 'INVALID')
  })

  it('call with non existent parent hash', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const blockDataNonExistentParentHash = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xf31969a769bfcdbcc1c05f2542fdc7aa9336fc1ea9a82c4925320c035095d649',
      },
    ]
    const res = await rpc.request(method, blockDataNonExistentParentHash)

    assert.strictEqual(res.result.status, 'ACCEPTED')
  })

  it('call with unknown parent hash to store in remoteBlocks, then call valid ancestor in fcU', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    let res = await rpc.request(method, [beaconData[1]])

    assert.strictEqual(res.result.status, 'ACCEPTED')

    res = await rpc.request(method, [beaconData[0]])

    assert.strictEqual(res.result.status, 'VALID')

    const state = {
      headBlockHash: beaconData[1].blockHash,
      safeBlockHash: beaconData[1].blockHash,
      finalizedBlockHash: beaconData[0].blockHash,
    }
    res = await rpc.request('engine_forkchoiceUpdatedV1', [state])

    assert.strictEqual(res.result.payloadStatus.status, 'SYNCING')

    // now block2 should be executed
    res = await rpc.request(method, [beaconData[1]])

    assert.strictEqual(res.result.status, 'VALID')
  })

  it('call with valid data', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [blockData])

    assert.strictEqual(res.result.status, 'VALID')
    assert.strictEqual(res.result.latestValidHash, blockData.blockHash)
  })

  it('call with valid data but invalid transactions', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const blockDataWithInvalidTransaction = {
      ...blockData,
      transactions: ['0x1'],
    }
    const res = await rpc.request(method, [blockDataWithInvalidTransaction])
    assert.strictEqual(res.result.status, 'INVALID')
    assert.strictEqual(res.result.latestValidHash, blockData.parentHash)
    const expectedError = 'Invalid tx at index 0: Error: Invalid serialized tx input: must be array'
    assert.isTrue(
      res.result.validationError.includes(expectedError),
      `should error with - ${expectedError}`,
    )
  })

  it('call with valid data & valid transaction but not signed', async () => {
    const { server, common } = await setupChain(postMergeGethGenesis, 'post-merge', {
      engine: true,
    })
    const rpc = getRPCClient(server)

    // Let's mock a non-signed transaction so execution fails
    const tx = createFeeMarket1559Tx(
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
    assert.strictEqual(res.result.status, 'INVALID')
    assert.isTrue(res.result.validationError.includes('transaction at index 0 is unsigned'))
  })

  it('call with valid data & valid transaction', async () => {
    const newGenesisJSON = {
      ...postMergeGethGenesis,
      alloc: {
        ...postMergeGethGenesis.alloc,
        [SIGNER_G.address.toString()]: {
          balance: '0x1000000',
        },
      },
    }

    const { server, common } = await setupChain(newGenesisJSON, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const tx = createFeeMarket1559Tx(
      {
        maxFeePerGas: '0x7',
        value: 6,
        gasLimit: 53_000,
      },
      { common },
    ).sign(SIGNER_G.privateKey)
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
    assert.strictEqual(res.result.status, 'VALID')
  })

  it('re-execute payload and verify that no errors occur', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    await batchBlocks(rpc, beaconData)

    // Let's set new head hash
    let res = await rpc.request('engine_forkchoiceUpdatedV1', [
      {
        headBlockHash: beaconData[2].blockHash,
        finalizedBlockHash: beaconData[2].blockHash,
        safeBlockHash: beaconData[2].blockHash,
      },
    ])

    assert.strictEqual(res.result.payloadStatus.status, 'VALID')

    // Now let's try to re-execute payload
    res = await rpc.request(method, [blockData])

    assert.strictEqual(res.result.status, 'VALID')
  })

  it('parent hash equals to block hash', async () => {
    const { server } = await setupChain(postMergeGethGenesis, 'post-merge', { engine: true })
    const rpc = getRPCClient(server)
    const blockDataHasBlockHashSameAsParentHash = [
      {
        ...blockData,
        blockHash: blockData.parentHash,
      },
    ]
    const res = await rpc.request(method, blockDataHasBlockHashSameAsParentHash)

    assert.strictEqual(res.result.status, 'INVALID')
  })

  it('call with executionPayloadV2', () => {
    assert.isTrue(true, 'TODO: add tests for executionPayloadV2')
    // TODO: add tests for executionPayloadV2
  })
})
