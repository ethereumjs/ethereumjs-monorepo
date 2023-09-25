import { BlockHeader } from '@ethereumjs/block'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/eip4844.json'
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { HttpServer } from 'jayson'

const method = 'engine_newPayloadV3'

// blocks are missing excessBlobGas and blobGasUsed which will be set to default 0 for 4844 blocks
// however its not required to set to correct value to test for versioned hashes test cases
const [blockData] = blocks

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation

export const batchBlocks = async (server: HttpServer) => {
  for (let i = 0; i < 3; i++) {
    const req = params(method, [blocks[i], []])
    const expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(server, req, 200, expectRes, false)
  }
}

describe(`${method}: Cancun validations`, () => {
  it('blobVersionedHashes', async () => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

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
    let req = params(method, blockDataExtraVersionedHashes)
    let expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'INVALID')
      assert.equal(
        res.body.result.validationError,
        'Error verifying blobVersionedHashes: expected=0 received=2'
      )
    }

    await baseRequest(server, req, 200, expectRes, false)

    const txString =
      '0x03f87c01808405f5e1008502540be4008401c9c380808080c001e1a001317228841f747eac2b4987a0225753a4f81688b31b21192ad2d2a3f5d252c580a01146addbda4889ddeaa8e4d74baae37c55f9796ab17030c762260faa797ca33ea0555a673397ea115d81c390a560ab77d3f63e93a59270b1b8d12cd2a1fb8b9b11'
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
    req = params(method, blockDataNoneHashes)
    expectRes = checkError(
      INVALID_PARAMS,
      'missing value for required argument blobVersionedHashes'
    )
    await baseRequest(server, req, 200, expectRes, false)

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
    req = params(method, blockDataMissingParentBeaconRoot)
    expectRes = checkError(
      INVALID_PARAMS,
      'missing value for required argument parentBeaconBlockRoot'
    )
    await baseRequest(server, req, 200, expectRes, false)

    const blockDataExtraMissingHashes1 = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xeea272bb9ac158550c645a1b0666727a5fefa4a865f8d4c642a87143d2abef39',
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
        // two blob transactions but missing versioned hash of second
        transactions: [txString, txString],
      },
      txVersionedHashesString,
      parentBeaconBlockRoot,
    ]
    req = params(method, blockDataExtraMissingHashes1)
    expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'INVALID')
      assert.equal(
        res.body.result.validationError,
        'Error verifying blobVersionedHashes: expected=2 received=1'
      )
    }
    await baseRequest(server, req, 200, expectRes, false)

    const blockDataExtraMisMatchingHashes1 = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xeea272bb9ac158550c645a1b0666727a5fefa4a865f8d4c642a87143d2abef39',
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
        // two blob transactions but mismatching versioned hash of second
        transactions: [txString, txString],
      },
      [...txVersionedHashesString, '0x3456'],
      parentBeaconBlockRoot,
    ]
    req = params(method, blockDataExtraMisMatchingHashes1)
    expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'INVALID')
      assert.equal(
        res.body.result.validationError,
        'Error verifying blobVersionedHashes: mismatch at index=1 expected=0x0131…52c5 received=0x3456…'
      )
    }
    await baseRequest(server, req, 200, expectRes, false)

    const blockDataMatchingVersionedHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0xeea272bb9ac158550c645a1b0666727a5fefa4a865f8d4c642a87143d2abef39',
        withdrawals: [],
        blobGasUsed: '0x40000',
        excessBlobGas: '0x0',
        // two blob transactions with matching versioned hashes
        transactions: [txString, txString],
      },
      [...txVersionedHashesString, ...txVersionedHashesString],
      parentBeaconBlockRoot,
    ]
    req = params(method, blockDataMatchingVersionedHashes)
    expectRes = (res: any) => {
      assert.equal(res.body.result.status, 'ACCEPTED')
    }
    await baseRequest(server, req, 200, expectRes)
  })

  it(`reset TD`, () => {
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
