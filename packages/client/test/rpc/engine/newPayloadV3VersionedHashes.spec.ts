import { BlockHeader } from '@ethereumjs/block'
import * as tape from 'tape'
import * as td from 'testdouble'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import blocks = require('../../testdata/blocks/beacon.json')
import genesisJSON = require('../../testdata/geth-genesis/eip4844.json')
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { HttpServer } from 'jayson'
type Test = tape.Test

const method = 'engine_newPayloadV3'

const [blockData] = blocks

const originalValidate = BlockHeader.prototype._consensusFormatValidation

export const batchBlocks = async (t: Test, server: HttpServer) => {
  for (let i = 0; i < 3; i++) {
    const req = params(method, [blocks[i], []])
    const expectRes = (res: any) => {
      t.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(t, server, req, 200, expectRes, false)
  }
}

tape(`${method}: Cancun validations`, (v1) => {
  v1.test(`${method}: versionedHashes`, async (t) => {
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

    const blockDataExtraVersionedHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x5493df0b38523c8e61cd7dd72ac21b023dc5357a5f297ff8db95a03f8a9c4179',
      },
      ['0x3434', '0x2334'],
    ]
    let req = params(method, blockDataExtraVersionedHashes)
    let expectRes = (res: any) => {
      t.equal(res.body.result.status, 'INVALID')
      t.equal(
        res.body.result.validationError,
        'Error verifying versionedHashes: expected=0 received=2'
      )
    }

    await baseRequest(t, server, req, 200, expectRes, false)

    const txString =
      '0x03f87c01808405f5e1008502540be4008401c9c380808080c001e1a001317228841f747eac2b4987a0225753a4f81688b31b21192ad2d2a3f5d252c580a01146addbda4889ddeaa8e4d74baae37c55f9796ab17030c762260faa797ca33ea0555a673397ea115d81c390a560ab77d3f63e93a59270b1b8d12cd2a1fb8b9b11'
    const txVersionedHashesString = [
      '0x01317228841f747eac2b4987a0225753a4f81688b31b21192ad2d2a3f5d252c5',
    ]

    const blockDataNoneHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x701f665755524486783d70ea3808f6d013ddfcd03972bd87eace1f29a44a83e8',
        // two blob transactions but no versioned hashes
        transactions: [txString, txString],
      },
    ]
    req = params(method, blockDataNoneHashes)
    expectRes = checkError(t, INVALID_PARAMS, 'Missing versionedHashes after Cancun is activated')
    await baseRequest(t, server, req, 200, expectRes, false)

    const blockDataExtraMissingHashes1 = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x701f665755524486783d70ea3808f6d013ddfcd03972bd87eace1f29a44a83e8',
        // two blob transactions but missing versioned hash of second
        transactions: [txString, txString],
      },
      txVersionedHashesString,
    ]
    req = params(method, blockDataExtraMissingHashes1)
    expectRes = (res: any) => {
      t.equal(res.body.result.status, 'INVALID')
      t.equal(
        res.body.result.validationError,
        'Error verifying versionedHashes: expected=2 received=1'
      )
    }
    await baseRequest(t, server, req, 200, expectRes, false)

    const blockDataExtraMisMatchingHashes1 = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x701f665755524486783d70ea3808f6d013ddfcd03972bd87eace1f29a44a83e8',
        // two blob transactions but mismatching versioned hash of second
        transactions: [txString, txString],
      },
      [...txVersionedHashesString, '0x3456'],
    ]
    req = params(method, blockDataExtraMisMatchingHashes1)
    expectRes = (res: any) => {
      t.equal(res.body.result.status, 'INVALID')
      t.equal(
        res.body.result.validationError,
        'Error verifying versionedHashes: mismatch at index=1 expected=0x0131…52c5 received=0x3456…'
      )
    }
    await baseRequest(t, server, req, 200, expectRes, false)

    const blockDataMatchingVersionedHashes = [
      {
        ...blockData,
        parentHash: '0x2559e851470f6e7bbed1db474980683e8c315bfce99b2a6ef47c057c04de7858',
        blockHash: '0x701f665755524486783d70ea3808f6d013ddfcd03972bd87eace1f29a44a83e8',
        // two blob transactions with matching versioned hashes
        transactions: [txString, txString],
      },
      [...txVersionedHashesString, ...txVersionedHashesString],
    ]
    req = params(method, blockDataMatchingVersionedHashes)
    expectRes = (res: any) => {
      t.equal(res.body.result.status, 'ACCEPTED')
    }
    await baseRequest(t, server, req, 200, expectRes)
  })

  v1.test(`reset TD`, (t) => {
    BlockHeader.prototype._consensusFormatValidation = originalValidate
    td.reset()
    t.end()
  })
  v1.end()
})
