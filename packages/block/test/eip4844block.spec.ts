import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction, initKZG } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
} from '@ethereumjs/tx/test/utils/blobHelpers'
import * as kzg from 'c-kzg'
import { randomBytes } from 'crypto'
import * as tape from 'tape'

import { calcExcessDataGas, getDataGasPrice } from '../src'
import { BlockHeader } from '../src/header'
import { calcDataFee, fakeExponential } from '../src/helpers'

// Hack to detect if running in browser or not
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

initKZG(kzg)
const gethGenesis = require('./testdata/post-merge-hardfork.json')
const common = Common.fromGethGenesis(gethGenesis, {
  chain: 'customChain',
  hardfork: Hardfork.ShardingFork,
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
    t.end()
  }
})

tape('data gas tests', async (t) => {
  if (isBrowser() === true) {
    t.end()
  } else {
    const lowGasHeader = BlockHeader.fromHeaderData(
      { number: 1, excessDataGas: 5000 },
      { common, skipConsensusFormatValidation: true }
    )
    let excessDataGas = calcExcessDataGas(lowGasHeader, 1)
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

    // Initialize KZG environment (i.e. trusted setup)
    kzg.loadTrustedSetup(__dirname.split('/block')[0] + '/tx/src/kzg/trusted_setup.txt')

    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(blobs)
    const versionedHashes = commitmentsToVersionedHashes(commitments)

    kzg.freeTrustedSetup()
    // Cleanup KZG environment (i.e. remove trusted setup)

    const bufferedHashes = versionedHashes.map((el) => Buffer.from(el))

    const unsignedTx = BlobEIP4844Transaction.fromTxData({
      versionedHashes: bufferedHashes,
      blobs,
      kzgCommitments: commitments,
      maxFeePerDataGas: 100000000n,
      gasLimit: 0xffffffn,
      to: randomBytes(20),
    })

    t.equal(calcDataFee(unsignedTx, lowGasHeader), 131072n, 'compute data fee correctly')
    t.equal(calcDataFee(unsignedTx, highGasHeader), 786432n, 'compute data fee correctly')
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
