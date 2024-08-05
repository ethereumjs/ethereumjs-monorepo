import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { create4844BlobTx } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  createAddressFromString,
  getBlobs,
  hexToBytes,
  privateToAddress,
  zeros,
} from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import * as genesisJSON from '../../../../client/test/testdata/geth-genesis/eip4844.json'
import { VM, buildBlock, runBlock } from '../../../src/index.js'
import { setBalance } from '../utils.js'

const pk = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = bytesToHex(privateToAddress(pk))

describe('EIP4844 tests', () => {
  it('should build a block correctly with blobs', async () => {
    const kzg = await loadKZG()

    const common = createCommonFromGethGenesis(genesisJSON, {
      chain: 'eip4844',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })
    const genesisBlock = createBlock(
      { header: { gasLimit: 50000, parentBeaconBlockRoot: zeros(32) } },
      { common },
    )
    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await VM.create({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, 14680063125000000000n)
    const vmCopy = await vm.shallowCopy()

    const blockBuilder = await buildBlock(vm, {
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
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobsToProofs(kzg, blobs, commitments)
    const unsignedTx = create4844BlobTx(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerGas: 10000000000n,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffn,
        to: hexToBytes('0xffb38a7a99e3e2335be83fc74b7faa19d5531243'),
      },
      { common },
    )
    const signedTx = unsignedTx.sign(pk)

    await blockBuilder.addTransaction(signedTx)

    const block = await blockBuilder.build()
    assert.equal(block.transactions.length, 1, 'blob transaction should be included')
    assert.equal(
      bytesToHex(block.transactions[0].hash()),
      bytesToHex(signedTx.hash()),
      'blob transaction should be same',
    )

    const blobGasPerBlob = common.param('blobGasPerBlob')
    assert.equal(block.header.blobGasUsed, blobGasPerBlob, 'blob gas used for 1 blob should match')

    // block should successfully execute with VM.runBlock and have same outputs
    const result = await runBlock(vmCopy, { block, skipBlockValidation: true })
    assert.equal(result.gasUsed, block.header.gasUsed)
    assert.deepEqual(result.receiptsRoot, block.header.receiptTrie)
    assert.deepEqual(result.stateRoot, block.header.stateRoot)
    assert.deepEqual(result.logsBloom, block.header.logsBloom)
  })
})
