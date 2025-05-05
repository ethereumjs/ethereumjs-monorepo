import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { createBlob4844Tx } from '@ethereumjs/tx'
import {
  Units,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  createAddressFromString,
  getBlobs,
  hexToBytes,
  privateToAddress,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, describe, it } from 'vitest'

import { buildBlock, createVM, runBlock } from '../../../src/index.ts'
import { setBalance } from '../utils.ts'

const pk = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = bytesToHex(privateToAddress(pk))

describe('EIP4844 tests', () => {
  const kzg = new microEthKZG(trustedSetup)
  it('should build a block correctly with blobs', async () => {
    const common = createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'eip4844',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })
    const genesisBlock = createBlock(
      { header: { gasLimit: 50000, parentBeaconBlockRoot: new Uint8Array(32) } },
      { common },
    )
    const blockchain = await createBlockchain({
      genesisBlock,
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await createVM({ common, blockchain })

    const address = createAddressFromString(sender)
    await setBalance(vm, address, Units.gwei(14680063125))
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
    const unsignedTx = createBlob4844Tx(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerGas: Units.gwei(10),
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffn,
        to: hexToBytes('0xffb38a7a99e3e2335be83fc74b7faa19d5531243'),
      },
      { common },
    )
    const signedTx = unsignedTx.sign(pk)

    await blockBuilder.addTransaction(signedTx)

    const { block } = await blockBuilder.build()
    assert.strictEqual(block.transactions.length, 1, 'blob transaction should be included')
    assert.strictEqual(
      bytesToHex(block.transactions[0].hash()),
      bytesToHex(signedTx.hash()),
      'blob transaction should be same',
    )

    const blobGasPerBlob = common.param('blobGasPerBlob')
    assert.strictEqual(
      block.header.blobGasUsed,
      blobGasPerBlob,
      'blob gas used for 1 blob should match',
    )

    // block should successfully execute with VM.runBlock and have same outputs
    const result = await runBlock(vmCopy, { block, skipBlockValidation: true })
    assert.strictEqual(result.gasUsed, block.header.gasUsed)
    assert.deepEqual(result.receiptsRoot, block.header.receiptTrie)
    assert.deepEqual(result.stateRoot, block.header.stateRoot)
    assert.deepEqual(result.logsBloom, block.header.logsBloom)
  })
}, 20000)
