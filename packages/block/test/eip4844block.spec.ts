import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
  initKZG,
  randomBytes,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { assert, describe, it } from 'vitest'

import { BlockHeader } from '../src/header.js'
import { fakeExponential, getNumBlobs } from '../src/helpers.js'
import { Block } from '../src/index.js'

import gethGenesis from './testdata/4844-hardfork.json'

import type { TypedTransaction } from '@ethereumjs/tx'
// Hack to detect if running in browser or not
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

if (isBrowser() === false) {
  try {
    initKZG(kzg, __dirname + '/../../client/src/trustedSetups/devnet6.txt')
    // eslint-disable-next-line
  } catch {}
}
const common = Common.fromGethGenesis(gethGenesis, {
  chain: 'customChain',
  hardfork: Hardfork.Cancun,
})
const dataGasPerBlob = common.param('gasConfig', 'dataGasPerBlob')

describe('EIP4844 header tests', () => {
  it('should work', () => {
    if (isBrowser() === false) {
      const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

      assert.throws(
        () => {
          BlockHeader.fromHeaderData(
            {
              excessDataGas: 1n,
            },
            {
              common: earlyCommon,
            }
          )
        },
        'excess data gas can only be provided with EIP4844 activated',
        undefined,
        'should throw when setting excessDataGas with EIP4844 not being activated'
      )

      assert.throws(
        () => {
          BlockHeader.fromHeaderData(
            {
              dataGasUsed: 1n,
            },
            {
              common: earlyCommon,
            }
          )
        },
        'data gas used can only be provided with EIP4844 activated',
        undefined,
        'should throw when setting dataGasUsed with EIP4844 not being activated'
      )

      const excessDataGas = BlockHeader.fromHeaderData(
        {},
        { common, skipConsensusFormatValidation: true }
      ).excessDataGas
      assert.equal(
        excessDataGas,
        0n,
        'instantiates block with reasonable default excess data gas value when not provided'
      )
      assert.doesNotThrow(() => {
        BlockHeader.fromHeaderData(
          {
            excessDataGas: 0n,
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
      assert.equal(
        block.toJSON().header?.excessDataGas,
        '0x0',
        'JSON output includes excessDataGas'
      )
    }
  })
})

describe('data gas tests', () => {
  it('should work', () => {
    if (isBrowser() === false) {
      const preShardingHeader = BlockHeader.fromHeaderData({})

      let excessDataGas = preShardingHeader.calcNextExcessDataGas()
      assert.equal(
        excessDataGas,
        0n,
        'excess data gas where 4844 is not active on header should be 0'
      )

      assert.throws(
        () => preShardingHeader.calcDataFee(1),
        'header must have excessDataGas field',
        undefined,
        'calcDataFee throws when header has no excessDataGas field'
      )

      const lowGasHeader = BlockHeader.fromHeaderData(
        { number: 1, excessDataGas: 5000 },
        { common, skipConsensusFormatValidation: true }
      )

      excessDataGas = lowGasHeader.calcNextExcessDataGas()
      let dataGasPrice = lowGasHeader.getDataGasPrice()
      assert.equal(
        excessDataGas,
        0n,
        'excess data gas should be 0 for small parent header data gas'
      )
      assert.equal(dataGasPrice, 1n, 'data gas price should be 1n when low or no excess data gas')
      const highGasHeader = BlockHeader.fromHeaderData(
        { number: 1, excessDataGas: 6291456, dataGasUsed: BigInt(6) * dataGasPerBlob },
        { common, skipConsensusFormatValidation: true }
      )
      excessDataGas = highGasHeader.calcNextExcessDataGas()
      dataGasPrice = highGasHeader.getDataGasPrice()
      assert.equal(excessDataGas, 6684672n)
      assert.equal(dataGasPrice, 6n, 'computed correct data gas price')

      assert.equal(lowGasHeader.calcDataFee(1), 131072n, 'compute data fee correctly')
      assert.equal(highGasHeader.calcDataFee(4), 3145728n, 'compute data fee correctly')
      assert.equal(highGasHeader.calcDataFee(6), 4718592n, 'compute data fee correctly')
    }
  })
})

describe('transaction validation tests', () => {
  it('should work', () => {
    if (isBrowser() === false) {
      const blobs = getBlobs('hello world')
      const commitments = blobsToCommitments(blobs)
      const versionedHashes = commitmentsToVersionedHashes(commitments)

      const tx1 = BlobEIP4844Transaction.fromTxData(
        {
          versionedHashes,
          blobs,
          kzgCommitments: commitments,
          maxFeePerDataGas: 100000000n,
          gasLimit: 0xffffffn,
          to: randomBytes(20),
        },
        { common }
      ).sign(randomBytes(32))
      const tx2 = BlobEIP4844Transaction.fromTxData(
        {
          versionedHashes,
          blobs,
          kzgCommitments: commitments,
          maxFeePerDataGas: 1n,
          gasLimit: 0xffffffn,
          to: randomBytes(20),
        },
        { common }
      ).sign(randomBytes(32))

      const parentHeader = BlockHeader.fromHeaderData(
        { number: 1n, excessDataGas: 4194304, dataGasUsed: 0 },
        { common, skipConsensusFormatValidation: true }
      )
      const excessDataGas = parentHeader.calcNextExcessDataGas()

      // eslint-disable-next-line no-inner-declarations
      function getBlock(transactions: TypedTransaction[]) {
        const blobs = getNumBlobs(transactions)

        const blockHeader = BlockHeader.fromHeaderData(
          {
            number: 2n,
            parentHash: parentHeader.hash(),
            excessDataGas,
            dataGasUsed: BigInt(blobs) * dataGasPerBlob,
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
        'does not throw when all tx maxFeePerDataGas are >= to block data gas fee'
      )
      const blockJson = blockWithValidTx.toJSON()
      blockJson.header!.dataGasUsed = '0x0'
      const blockWithInvalidHeader = Block.fromBlockData(blockJson, { common })
      assert.throws(
        () => blockWithInvalidHeader.validateBlobTransactions(parentHeader),
        'block dataGasUsed mismatch',
        undefined,
        'throws with correct error message when tx maxFeePerDataGas less than block data gas fee'
      )

      assert.throws(
        () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
        'than block data gas price',
        undefined,
        'throws with correct error message when tx maxFeePerDataGas less than block data gas fee'
      )
      assert.throws(
        () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
        'than block data gas price',
        undefined,
        'throws with correct error message when tx maxFeePerDataGas less than block data gas fee'
      )
      assert.throws(
        () => blockWithTooManyBlobs.validateBlobTransactions(parentHeader),
        'exceed maximum data gas per block',
        undefined,
        'throws with correct error message when tx maxFeePerDataGas less than block data gas fee'
      )

      assert.ok(
        blockWithTooManyBlobs
          .validateTransactions(true)
          .join(' ')
          .includes('exceed maximum data gas per block'),
        'tx erros includes correct error message when too many blobs in a block'
      )
    }
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
