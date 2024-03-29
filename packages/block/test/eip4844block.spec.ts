import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
  randomBytes,
} from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { BlockHeader } from '../src/header.js'
import { fakeExponential, getNumBlobs } from '../src/helpers.js'
import { Block } from '../src/index.js'

import gethGenesis from './testdata/4844-hardfork.json'

import type { TypedTransaction } from '@ethereumjs/tx'
import type { Kzg } from '@ethereumjs/util'

describe('EIP4844 header tests', () => {
  let common: Common

  beforeAll(async () => {
    const kzg = await loadKZG()

    common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })
  })

  it('should work', () => {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            excessBlobGas: 1n,
          },
          {
            common: earlyCommon,
          }
        )
      },
      'excess blob gas can only be provided with EIP4844 activated',
      undefined,
      'should throw when setting excessBlobGas with EIP4844 not being activated'
    )

    assert.throws(
      () => {
        BlockHeader.fromHeaderData(
          {
            blobGasUsed: 1n,
          },
          {
            common: earlyCommon,
          }
        )
      },
      'blob gas used can only be provided with EIP4844 activated',
      undefined,
      'should throw when setting blobGasUsed with EIP4844 not being activated'
    )

    const excessBlobGas = BlockHeader.fromHeaderData(
      {},
      { common, skipConsensusFormatValidation: true }
    ).excessBlobGas
    assert.equal(
      excessBlobGas,
      0n,
      'instantiates block with reasonable default excess blob gas value when not provided'
    )
    assert.doesNotThrow(() => {
      BlockHeader.fromHeaderData(
        {
          excessBlobGas: 0n,
        },
        {
          common,
          skipConsensusFormatValidation: true,
        }
      )
    }, 'correctly instantiates an EIP4844 block header')

    const block = Block.fromBlockData(
      {
        header: BlockHeader.fromHeaderData({}, { common, skipConsensusFormatValidation: true }),
      },
      { common, skipConsensusFormatValidation: true }
    )
    assert.equal(block.toJSON().header?.excessBlobGas, '0x0', 'JSON output includes excessBlobGas')
  })
})

describe('blob gas tests', () => {
  let common: Common
  let blobGasPerBlob: bigint
  beforeAll(async () => {
    const kzg = await loadKZG()
    common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })
    blobGasPerBlob = common.param('gasConfig', 'blobGasPerBlob')
  })
  it('should work', () => {
    const preShardingHeader = BlockHeader.fromHeaderData({})

    let excessBlobGas = preShardingHeader.calcNextExcessBlobGas()
    assert.equal(
      excessBlobGas,
      0n,
      'excess blob gas where 4844 is not active on header should be 0'
    )

    assert.throws(
      () => preShardingHeader.calcDataFee(1),
      'header must have excessBlobGas field',
      undefined,
      'calcDataFee throws when header has no excessBlobGas field'
    )

    const lowGasHeader = BlockHeader.fromHeaderData(
      { number: 1, excessBlobGas: 5000 },
      { common, skipConsensusFormatValidation: true }
    )

    excessBlobGas = lowGasHeader.calcNextExcessBlobGas()
    let blobGasPrice = lowGasHeader.getBlobGasPrice()
    assert.equal(excessBlobGas, 0n, 'excess blob gas should be 0 for small parent header blob gas')
    assert.equal(blobGasPrice, 1n, 'blob gas price should be 1n when low or no excess blob gas')
    const highGasHeader = BlockHeader.fromHeaderData(
      { number: 1, excessBlobGas: 6291456, blobGasUsed: BigInt(6) * blobGasPerBlob },
      { common, skipConsensusFormatValidation: true }
    )
    excessBlobGas = highGasHeader.calcNextExcessBlobGas()
    blobGasPrice = highGasHeader.getBlobGasPrice()
    assert.equal(excessBlobGas, 6684672n)
    assert.equal(blobGasPrice, 6n, 'computed correct blob gas price')

    assert.equal(lowGasHeader.calcDataFee(1), 131072n, 'compute data fee correctly')
    assert.equal(highGasHeader.calcDataFee(4), 3145728n, 'compute data fee correctly')
    assert.equal(highGasHeader.calcDataFee(6), 4718592n, 'compute data fee correctly')

    const nextBlobGas = highGasHeader.calcNextBlobGasPrice()
    assert.equal(nextBlobGas, BigInt(7)) // TODO verify that this is correct
  })
})

describe('transaction validation tests', () => {
  let kzg: Kzg
  let common: Common
  let blobGasPerBlob: bigint
  beforeAll(async () => {
    kzg = await loadKZG()
    common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })
    blobGasPerBlob = common.param('gasConfig', 'blobGasPerBlob')
  })
  it('should work', () => {
    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)

    const tx1 = BlobEIP4844Transaction.fromTxData(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common }
    ).sign(randomBytes(32))
    const tx2 = BlobEIP4844Transaction.fromTxData(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        maxFeePerBlobGas: 1n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common }
    ).sign(randomBytes(32))

    const parentHeader = BlockHeader.fromHeaderData(
      { number: 1n, excessBlobGas: 4194304, blobGasUsed: 0 },
      { common, skipConsensusFormatValidation: true }
    )
    const excessBlobGas = parentHeader.calcNextExcessBlobGas()

    // eslint-disable-next-line no-inner-declarations
    function getBlock(transactions: TypedTransaction[]) {
      const blobs = getNumBlobs(transactions)

      const blockHeader = BlockHeader.fromHeaderData(
        {
          number: 2n,
          parentHash: parentHeader.hash(),
          excessBlobGas,
          blobGasUsed: BigInt(blobs) * blobGasPerBlob,
        },
        { common, skipConsensusFormatValidation: true }
      )
      const block = Block.fromBlockData(
        { header: blockHeader, transactions },
        { common, skipConsensusFormatValidation: true }
      )
      return block
    }

    const blockWithValidTx = getBlock([tx1])

    const blockWithInvalidTx = getBlock([tx1, tx2])

    const blockWithTooManyBlobs = getBlock([tx1, tx1, tx1, tx1, tx1, tx1, tx1])

    assert.doesNotThrow(
      () => blockWithValidTx.validateBlobTransactions(parentHeader),
      'does not throw when all tx maxFeePerBlobGas are >= to block blob gas fee'
    )
    const blockJson = blockWithValidTx.toJSON()
    blockJson.header!.blobGasUsed = '0x0'
    const blockWithInvalidHeader = Block.fromBlockData(blockJson, { common })
    assert.throws(
      () => blockWithInvalidHeader.validateBlobTransactions(parentHeader),
      'block blobGasUsed mismatch',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee'
    )

    assert.throws(
      () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
      'than block blob gas price',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee'
    )
    assert.throws(
      () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
      'than block blob gas price',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee'
    )
    assert.throws(
      () => blockWithTooManyBlobs.validateBlobTransactions(parentHeader),
      'exceed maximum blob gas per block',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee'
    )

    assert.ok(
      blockWithTooManyBlobs
        .getTransactionsValidationErrors()
        .join(' ')
        .includes('exceed maximum blob gas per block'),
      'tx erros includes correct error message when too many blobs in a block'
    )
  })
})

describe('fake exponential', () => {
  it('should work', () => {
    // Test inputs borrowed from geth - https://github.com/mdehoog/go-ethereum/blob/a915d56f1d52906470ddce1bda7fa916044b6f95/consensus/misc/eip4844_test.go#L26
    const testInputs = [
      [1, 0, 1, 1],
      [38493, 0, 1000, 38493],
      [0, 1234, 2345, 0],
      [1, 2, 1, 6],
      [1, 4, 2, 6],
      [1, 3, 1, 16],
      [1, 6, 2, 18],
      [1, 4, 1, 49],
      [1, 8, 2, 50],
      [10, 8, 2, 542],
      [11, 8, 2, 596],
      [1, 5, 1, 136],
      [1, 5, 2, 11],
      [2, 5, 2, 23],
    ]
    for (const input of testInputs) {
      assert.equal(
        fakeExponential(BigInt(input[0]), BigInt(input[1]), BigInt(input[2])),
        BigInt(input[3]),
        'fake exponential produced expected output'
      )
    }
  })
})
