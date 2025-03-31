import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import { createBlob4844Tx } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
  randomBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, describe, it } from 'vitest'

import { fakeExponential, getNumBlobs } from '../src/helpers.ts'
import { createBlock, createBlockHeader } from '../src/index.ts'
import { paramsBlock } from '../src/params.ts'

import { hardfork4844Data } from './testdata/4844-hardfork.ts'

import type { TypedTransaction } from '@ethereumjs/tx'

describe('EIP4844 header tests', () => {
  const kzg = new microEthKZG(trustedSetup)

  const common = createCommonFromGethGenesis(hardfork4844Data, {
    chain: 'customChain',
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  it('should work', () => {
    const earlyCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })

    assert.throws(
      () => {
        createBlockHeader(
          {
            excessBlobGas: 1n,
          },
          {
            common: earlyCommon,
          },
        )
      },
      'excess blob gas can only be provided with EIP4844 activated',
      undefined,
      'should throw when setting excessBlobGas with EIP4844 not being activated',
    )

    assert.throws(
      () => {
        createBlockHeader(
          {
            blobGasUsed: 1n,
          },
          {
            common: earlyCommon,
          },
        )
      },
      'blob gas used can only be provided with EIP4844 activated',
      undefined,
      'should throw when setting blobGasUsed with EIP4844 not being activated',
    )

    const excessBlobGas = createBlockHeader(
      {},
      { common, skipConsensusFormatValidation: true },
    ).excessBlobGas
    assert.equal(
      excessBlobGas,
      0n,
      'instantiates block with reasonable default excess blob gas value when not provided',
    )
    assert.doesNotThrow(() => {
      createBlockHeader(
        {
          excessBlobGas: 0n,
        },
        {
          common,
          skipConsensusFormatValidation: true,
        },
      )
    }, 'correctly instantiates an EIP4844 block header')

    const block = createBlock(
      {
        header: createBlockHeader({}, { common, skipConsensusFormatValidation: true }),
      },
      { common, skipConsensusFormatValidation: true },
    )
    assert.equal(block.toJSON().header?.excessBlobGas, '0x0', 'JSON output includes excessBlobGas')
  })
})

describe('blob gas tests', () => {
  const kzg = new microEthKZG(trustedSetup)

  const common = createCommonFromGethGenesis(hardfork4844Data, {
    chain: 'customChain',
    hardfork: Hardfork.Cancun,
    params: paramsBlock,
    customCrypto: { kzg },
  })
  const blobGasPerBlob = common.param('blobGasPerBlob')

  it('should work', () => {
    const preShardingHeader = createBlockHeader(
      {},
      { common: new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai }) },
    )

    let excessBlobGas = preShardingHeader.calcNextExcessBlobGas(common)
    assert.equal(
      excessBlobGas,
      0n,
      'excess blob gas where 4844 is not active on header should be 0',
    )

    assert.throws(
      () => preShardingHeader.calcDataFee(1),
      'header must have excessBlobGas field',
      undefined,
      'calcDataFee throws when header has no excessBlobGas field',
    )

    const lowGasHeader = createBlockHeader(
      { number: 1, excessBlobGas: 5000 },
      { common, skipConsensusFormatValidation: true },
    )

    excessBlobGas = lowGasHeader.calcNextExcessBlobGas(common)
    let blobGasPrice = lowGasHeader.getBlobGasPrice()
    assert.equal(excessBlobGas, 0n, 'excess blob gas should be 0 for small parent header blob gas')
    assert.equal(blobGasPrice, 1n, 'blob gas price should be 1n when low or no excess blob gas')
    const highGasHeader = createBlockHeader(
      { number: 1, excessBlobGas: 6291456, blobGasUsed: BigInt(6) * blobGasPerBlob },
      { common, skipConsensusFormatValidation: true },
    )
    excessBlobGas = highGasHeader.calcNextExcessBlobGas(common)
    blobGasPrice = highGasHeader.getBlobGasPrice()
    assert.equal(excessBlobGas, 6684672n)
    assert.equal(blobGasPrice, 6n, 'computed correct blob gas price')

    assert.equal(lowGasHeader.calcDataFee(1), 131072n, 'compute data fee correctly')
    assert.equal(highGasHeader.calcDataFee(4), 3145728n, 'compute data fee correctly')
    assert.equal(highGasHeader.calcDataFee(6), 4718592n, 'compute data fee correctly')

    const nextBlobGas = highGasHeader.calcNextBlobGasPrice(common)
    assert.equal(nextBlobGas, BigInt(7)) // TODO verify that this is correct
  })
})

describe('transaction validation tests', () => {
  const kzg = new microEthKZG(trustedSetup)

  const common = createCommonFromGethGenesis(hardfork4844Data, {
    chain: 'customChain',
    hardfork: Hardfork.Cancun,
    params: paramsBlock,
    customCrypto: { kzg },
  })
  const blobGasPerBlob = common.param('blobGasPerBlob')

  it('should work', () => {
    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)

    const tx1 = createBlob4844Tx(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common },
    ).sign(randomBytes(32))
    const tx2 = createBlob4844Tx(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        maxFeePerBlobGas: 1n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common },
    ).sign(randomBytes(32))

    const parentHeader = createBlockHeader(
      { number: 1n, excessBlobGas: 4194304, blobGasUsed: 0 },
      { common, skipConsensusFormatValidation: true },
    )
    const excessBlobGas = parentHeader.calcNextExcessBlobGas(common)

    function getBlock(transactions: TypedTransaction[]) {
      const blobs = getNumBlobs(transactions)

      const blockHeader = createBlockHeader(
        {
          number: 2n,
          parentHash: parentHeader.hash(),
          excessBlobGas,
          blobGasUsed: BigInt(blobs) * blobGasPerBlob,
        },
        { common, skipConsensusFormatValidation: true },
      )
      const block = createBlock(
        { header: blockHeader, transactions },
        { common, skipConsensusFormatValidation: true },
      )
      return block
    }

    const blockWithValidTx = getBlock([tx1])

    const blockWithInvalidTx = getBlock([tx1, tx2])

    const blockWithTooManyBlobs = getBlock([tx1, tx1, tx1, tx1, tx1, tx1, tx1])

    assert.doesNotThrow(
      () => blockWithValidTx.validateBlobTransactions(parentHeader),
      'does not throw when all tx maxFeePerBlobGas are >= to block blob gas fee',
    )
    const blockJSON = blockWithValidTx.toJSON()
    blockJSON.header!.blobGasUsed = '0x0'
    const blockWithInvalidHeader = createBlock(blockJSON, { common })
    assert.throws(
      () => blockWithInvalidHeader.validateBlobTransactions(parentHeader),
      'block blobGasUsed mismatch',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee',
    )

    assert.throws(
      () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
      'than block blob gas price',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee',
    )
    assert.throws(
      () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
      'than block blob gas price',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee',
    )
    assert.throws(
      () => blockWithTooManyBlobs.validateBlobTransactions(parentHeader),
      'exceed maximum blob gas per block',
      undefined,
      'throws with correct error message when tx maxFeePerBlobGas less than block blob gas fee',
    )

    assert.include(
      blockWithTooManyBlobs.getTransactionsValidationErrors().join(' '),
      'exceed maximum blob gas per block',
      'tx errors includes correct error message when too many blobs in a block',
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
        'fake exponential produced expected output',
      )
    }
  })
})
