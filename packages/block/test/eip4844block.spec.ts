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
import * as tape from 'tape'

import { Block, calcExcessDataGas, getDataGasPrice } from '../src'
import { BlockHeader } from '../src/header'
import { calcDataFee, fakeExponential } from '../src/helpers'

// Hack to detect if running in browser or not
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

if (isBrowser() === false) initKZG(kzg, __dirname + '/../../client/lib/trustedSetups/devnet4.txt')
const gethGenesis = require('./testdata/4844-hardfork.json')
const common = Common.fromGethGenesis(gethGenesis, {
  chain: 'customChain',
  hardfork: Hardfork.Cancun,
})

tape('EIP4844 header tests', function (t) {
  if (isBrowser() === true) {
    t.end()
  } else {
    const earlyCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    t.throws(
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
      (err: any) => {
        return (
          err.message.toString() === 'excess data gas can only be provided with EIP4844 activated'
        )
      },
      'should throw when setting excessDataGas with EIP4844 not being activated'
    )
    const excessDataGas = BlockHeader.fromHeaderData(
      {},
      { common, skipConsensusFormatValidation: true }
    ).excessDataGas
    t.equal(
      excessDataGas,
      0n,
      'instantiates block with reasonable default excess data gas value when not provided'
    )
    t.doesNotThrow(() => {
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
    t.equal(block.toJSON().header?.excessDataGas, '0x0', 'JSON output includes excessDataGas')
    t.end()
  }
})

tape('data gas tests', async (t) => {
  if (isBrowser() === true) {
    t.end()
  } else {
    const preShardingHeader = BlockHeader.fromHeaderData({})

    let excessDataGas = calcExcessDataGas(preShardingHeader, 2)
    t.equals(
      excessDataGas,
      0n,
      'excess data gas where 4844 is not active on parent header should be 0'
    )

    t.throws(
      () => getDataGasPrice(preShardingHeader),
      (err: any) => err.message.includes('parent header must have excessDataGas field'),
      'getDataGasPrice throws when header has no excessDataGas field'
    )

    t.throws(
      () =>
        calcDataFee(
          BlobEIP4844Transaction.fromTxData({}, { common }).numBlobs(),
          preShardingHeader
        ),
      (err: any) => err.message.includes('parent header must have excessDataGas field'),
      'calcDataFee throws when header has no excessDataGas field'
    )

    const lowGasHeader = BlockHeader.fromHeaderData(
      { number: 1, excessDataGas: 5000 },
      { common, skipConsensusFormatValidation: true }
    )

    excessDataGas = calcExcessDataGas(lowGasHeader, 1)
    let dataGasPrice = getDataGasPrice(lowGasHeader)
    t.equal(excessDataGas, 0n, 'excess data gas should be 0 for small parent header data gas')
    t.equal(dataGasPrice, 1n, 'data gas price should be 1n when low or no excess data gas')
    const highGasHeader = BlockHeader.fromHeaderData(
      { number: 1, excessDataGas: 4194304 },
      { common, skipConsensusFormatValidation: true }
    )
    excessDataGas = calcExcessDataGas(highGasHeader, 4)
    dataGasPrice = getDataGasPrice(highGasHeader)
    t.equal(excessDataGas, 4456448n)
    t.equal(dataGasPrice, 6n, 'computed correct data gas price')

    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(blobs)
    const versionedHashes = commitmentsToVersionedHashes(commitments)

    const unsignedTx = BlobEIP4844Transaction.fromTxData(
      {
        versionedHashes,
        blobs,
        kzgCommitments: commitments,
        maxFeePerDataGas: 100000000n,
        gasLimit: 0xffffffn,
        to: randomBytes(20),
      },
      { common }
    )

    t.equal(calcDataFee(unsignedTx.numBlobs(), lowGasHeader), 131072n, 'compute data fee correctly')
    t.equal(
      calcDataFee(unsignedTx.numBlobs(), highGasHeader),
      786432n,
      'compute data fee correctly'
    )
    t.end()
  }
})

tape('transaction validation tests', async (t) => {
  if (isBrowser() === true) {
    t.end()
  } else {
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
      { number: 1n, excessDataGas: 4194304 },
      { common, skipConsensusFormatValidation: true }
    )
    const blockHeader = BlockHeader.fromHeaderData(
      { number: 2n, parentHash: parentHeader.hash() },
      { common, skipConsensusFormatValidation: true }
    )

    const blockWithValidTx = Block.fromBlockData(
      { header: blockHeader, transactions: [tx1] },
      { common, skipConsensusFormatValidation: true }
    )

    const blockWithInvalidTx = Block.fromBlockData(
      { header: blockHeader, transactions: [tx1, tx2] },
      { common, skipConsensusFormatValidation: true }
    )

    const blockWithTooManyBlobs = Block.fromBlockData(
      { header: blockHeader, transactions: [tx1, tx1, tx1, tx1, tx1] },
      { common, skipConsensusFormatValidation: true }
    )
    t.doesNotThrow(
      () => blockWithValidTx.validateBlobTransactions(parentHeader),
      'does not throw when all tx maxFeePerDataGas are >= to block data gas fee'
    )
    t.throws(
      () => blockWithInvalidTx.validateBlobTransactions(parentHeader),
      (err: any) => err.message.includes('than block data gas price'),
      'throws with correct error message when tx maxFeePerDataGas less than block data gas fee'
    )

    t.ok(
      blockWithTooManyBlobs
        .validateTransactions(true)[4]
        .includes('exceed maximum data gas per block'),
      'tx erros includes correct error message when too many blobs in a block'
    )

    t.end()
  }
})

tape('fake exponential', (t) => {
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
    t.equal(
      fakeExponential(BigInt(input[0]), BigInt(input[1]), BigInt(input[2])),
      BigInt(input[3]),
      'fake exponential produced expected output'
    )
  }
  t.end()
})
