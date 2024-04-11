import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/eip4844.json'
import { getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_newPayloadV3'

// blocks are missing excessBlobGas and blobGasUsed which will be set to default 0 for 4844 blocks
// however its not required to set to correct value to test for versioned hashes test cases
const [blockData] = blocks

describe(`${method}: Cancun validations`, () => {
  it('blobVersionedHashes', async () => {
    const kzg = await loadKZG()

    const { server } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
      customCrypto: { kzg },
    })

    const rpc = getRpcClient(server)
    const parentBeaconBlockRoot =
      '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'
    const blockDataExtraVersionedHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xb8b9607bd09f0c18bccfa4dcb6fe355f07d383c902f0fc2a1671cf20792e131c',
        withdrawals: [],
        blobGasUsed: '0x0',
        excessBlobGas: '0x0',
      },
      // versioned hashes
      ['0x3434', '0x2334'],
      parentBeaconBlockRoot,
    ]
    let res = await rpc.request(method, blockDataExtraVersionedHashes)

    assert.equal(res.result.status, 'INVALID')
    assert.equal(
      res.result.validationError,
      'Error verifying blobVersionedHashes: expected=0 received=2'
    )

    const txString =
      '0x03f89001808405f5e1008502540be4008401c9c3809400000000000000000000000000000000000000008080c001e1a001317228841f747eac2b4987a0225753a4f81688b31b21192ad2d2a3f5d252c580a01146addbda4889ddeaa8e4d74baae37c55f9796ab17030c762260faa797ca33ea0555a673397ea115d81c390a560ab77d3f63e93a59270b1b8d12cd2a1fb8b9b11'
    const txVersionedHashesString = [
      '0x01317228841f747eac2b4987a0225753a4f81688b31b21192ad2d2a3f5d252c5',
    ]

    const blockDataNoneHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x141462264b2c27594e8cfcafcadd3545e08c657af4e5882096191632dd4cfc1c',
        // two blob transactions but no versioned hashes
        transactions: [txString, txString],
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
      },
    ]
    res = await rpc.request(method, blockDataNoneHashes)
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('missing value for required argument blobVersionedHashes'))

    const blockDataMissingParentBeaconRoot = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x141462264b2c27594e8cfcafcadd3545e08c657af4e5882096191632dd4cfc1c',
        // two blob transactions but no versioned hashes
        transactions: [txString, txString],
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
      },
      txVersionedHashesString,
    ]
    res = await rpc.request(method, blockDataMissingParentBeaconRoot)
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(
      res.error.message.includes('missing value for required argument parentBeaconBlockRoot')
    )

    const blockDataExtraMissingHashes1 = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xda4fd641baf437352c42dd2a46a28993854b51850938140cddc45ecc9e88b108',
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
        // two blob transactions but missing versioned hash of second
        transactions: [txString, txString],
      },
      txVersionedHashesString,
      parentBeaconBlockRoot,
    ]
    res = await rpc.request(method, blockDataExtraMissingHashes1)

    assert.equal(res.result.status, 'INVALID')
    assert.equal(
      res.result.validationError,
      'Error verifying blobVersionedHashes: expected=2 received=1'
    )

    const blockDataExtraMisMatchingHashes1 = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xda4fd641baf437352c42dd2a46a28993854b51850938140cddc45ecc9e88b108',
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
        // two blob transactions but mismatching versioned hash of second
        transactions: [txString, txString],
      },
      [...txVersionedHashesString, '0x3456'],
      parentBeaconBlockRoot,
    ]
    res = await rpc.request(method, blockDataExtraMisMatchingHashes1)

    assert.equal(res.result.status, 'INVALID')
    assert.equal(
      res.result.validationError,
      'Error verifying blobVersionedHashes: mismatch at index=1 expected=0x0131…52c5 received=0x3456…'
    )

    const blockDataMatchingVersionedHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xda4fd641baf437352c42dd2a46a28993854b51850938140cddc45ecc9e88b108',
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
        // two blob transactions with matching versioned hashes
        transactions: [txString, txString],
      },
      [...txVersionedHashesString, ...txVersionedHashesString],
      parentBeaconBlockRoot,
    ]
    res = await rpc.request(method, blockDataMatchingVersionedHashes)
    assert.equal(res.result.status, 'ACCEPTED')
  })
})
