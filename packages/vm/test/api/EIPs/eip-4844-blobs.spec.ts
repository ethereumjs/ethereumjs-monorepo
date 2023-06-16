import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  Address,
  blobsToCommitments,
  blobsToProofs,
  bytesToPrefixedHexString,
  commitmentsToVersionedHashes,
  getBlobs,
  initKZG,
  privateToAddress,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import genesisJSON = require('../../../../client/test/testdata/geth-genesis/eip4844.json')
import { VM } from '../../../src/vm'
import { setBalance } from '../utils'

// Hack to detect if running in browser or not
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

const pk = hexToBytes('20'.repeat(32))
const sender = bytesToPrefixedHexString(privateToAddress(pk))
if (isBrowser() === false) {
  try {
    initKZG(kzg, __dirname + '/../../../../client/src/trustedSetups/devnet6.txt')
    // eslint-disable-next-line
  } catch {}
}

describe('EIP4844 tests', () => {
  it('should build a block correctly with blobs', async () => {
    const common = Common.fromGethGenesis(genesisJSON, { chain: 'eip4844' })
    common.setHardfork(Hardfork.Cancun)
    const genesisBlock = Block.fromBlockData({ header: { gasLimit: 50000 } }, { common })
    const blockchain = await Blockchain.create({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await VM.create({ common, blockchain })

    const address = Address.fromString(sender)
    await setBalance(vm, address, 14680063125000000000n)
    const vmCopy = await vm.copy()

    const blockBuilder = await vm.buildBlock({
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
      },
      headerData: {
        gasLimit: 0xffffn,
      },
    })

    // Set up tx
    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(blobs)
    const versionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobsToProofs(blobs, commitments)
    const unsignedTx = BlobEIP4844Transaction.fromTxData(
      {
        versionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerGas: 10000000000n,
        maxFeePerDataGas: 100000000n,
        gasLimit: 0xffffn,
        to: hexToBytes('0xffb38a7a99e3e2335be83fc74b7faa19d5531243'),
      },
      { common }
    )
    const signedTx = unsignedTx.sign(pk)

    await blockBuilder.addTransaction(signedTx)

    const block = await blockBuilder.build()
    assert.equal(block.transactions.length, 1, 'blob transaction should be included')
    assert.equal(
      bytesToHex(block.transactions[0].hash()),
      bytesToHex(signedTx.hash()),
      'blob transaction should be same'
    )

    const dataGasPerBlob = common.param('gasConfig', 'dataGasPerBlob')
    assert.equal(block.header.dataGasUsed, dataGasPerBlob, 'data gas used for 1 blob should match')

    // block should successfully execute with VM.runBlock and have same outputs
    const result = await vmCopy.runBlock({ block, skipBlockValidation: true })
    assert.equal(result.gasUsed, block.header.gasUsed)
    assert.deepEqual(result.receiptsRoot, block.header.receiptTrie)
    assert.deepEqual(result.stateRoot, block.header.stateRoot)
    assert.deepEqual(result.logsBloom, block.header.logsBloom)
  })
})
