import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Hardfork, createCommonFromGethGenesis } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { osakaGethGenesis } from '@ethereumjs/testdata'
import { createBlob4844Tx, createBlob4844TxFromSerializedNetworkWrapper } from '@ethereumjs/tx'
import {
  Units,
  blobsToCellProofs,
  blobsToCommitments,
  bytesToHex,
  commitmentsToVersionedHashes,
  concatBytes,
  createAddressFromString,
  getBlobs,
  hexToBytes,
  intToUnpaddedBytes,
  privateToAddress,
  randomBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, expect, it } from 'vitest'

import { buildBlock, createVM, runBlock } from '../../../src/index.ts'
import { setBalance } from '../utils.ts'

const pk = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromString(bytesToHex(privateToAddress(pk)))

function createEip7594Wrapper(rawTx: ReturnType<ReturnType<typeof createBlob4844Tx>['raw']>, blobs: Uint8Array[], commitments: Uint8Array[], cellProofs: Uint8Array[]) {
  return concatBytes(
    new Uint8Array([0x03]),
    RLP.encode([rawTx, intToUnpaddedBytes(1), blobs, commitments, cellProofs]),
  )
}

describe('ETHJS Osaka builder state poison reproduction', () => {
  const kzg = new microEthKZG(trustedSetup)

  it('rolls back blob tx effects when Osaka revalidation fails', async () => {
    const preOsakaCommon = createCommonFromGethGenesis(osakaGethGenesis.osakaGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Prague,
      customCrypto: { kzg },
    })
    const osakaCommon = createCommonFromGethGenesis(osakaGethGenesis.osakaGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Osaka,
      customCrypto: { kzg },
    })

    const genesisBlock = createBlock(
      {
        header: {
          gasLimit: 300000n,
          parentBeaconBlockRoot: new Uint8Array(32),
          timestamp: BigInt(osakaGethGenesis.osakaTime - 12),
        },
      },
      { common: osakaCommon, skipConsensusFormatValidation: true },
    )
    const blockchain = await createBlockchain({
      genesisBlock,
      common: osakaCommon,
      validateBlocks: false,
      validateConsensus: false,
      hardforkByHeadBlockNumber: false,
    })
    const vm = await createVM({ common: osakaCommon, blockchain })

    await setBalance(vm, sender, BigInt('10000000000000000000'))
    const cleanVm = await vm.shallowCopy()

    const blobs = []
    for (let i = 0; i < 7; i++) {
      blobs.push(...getBlobs(`poison-${i}`))
    }

    /**
    const blobs: `0x${string}`[] = []

    for (let i = 0; i < 7; i++) {
      const data = bytesToHex(new TextEncoder().encode(`poison-${i}`))
      blobs.push(...getBlobs(data))
    }
    */

    assert.strictEqual(blobs.length, 7, 'should create a tx that is only invalid under Osaka')

    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
    const cellProofs = blobsToCellProofs(kzg, blobs)

  
    const preOsakaSignedTx = createBlob4844Tx(
      {
        blobVersionedHashes,
        maxFeePerGas: Units.gwei(10),
        maxPriorityFeePerGas: Units.gwei(1),
        maxFeePerBlobGas: 100000000n,
        gasLimit: 21000n,
        to: randomBytes(20),
        nonce: 0n,
      },
      { common: preOsakaCommon },
    ).sign(pk)

    const wrapper = createEip7594Wrapper(
      preOsakaSignedTx.raw(),
      blobs,
      commitments,
      cellProofs,
    )
    const decodedTx = createBlob4844TxFromSerializedNetworkWrapper(wrapper, {
      common: preOsakaCommon,
    })

    assert.strictEqual(decodedTx.common.hardfork(), Hardfork.Prague)
    assert.strictEqual(decodedTx.networkWrapperVersion, 1)
    assert.strictEqual(decodedTx.blobVersionedHashes.length, 7)

    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      withdrawals: [],
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
        putBlockIntoBlockchain: false,
      },
      headerData: {
        gasLimit: 300000n,
        timestamp: BigInt(osakaGethGenesis.osakaTime + 12),
      },
    })

    await expect(blockBuilder.addTransaction(decodedTx)).rejects.toThrow(
      /7 blobs exceeds max 6 blobs per tx \(EIP-7594\)/,
    )

    const blobGasPerBlob = osakaCommon.param('blobGasPerBlob')
    const expectedBlobGasUsed = blobGasPerBlob * 7n
    assert.strictEqual(
      blockBuilder.blobGasUsed,
      0n,
      'blob gas accounting must not be mutated when the tx is rejected',
    )
    /**
    assert.strictEqual(
      blockBuilder.blobGasUsed,
      expectedBlobGasUsed,
      'blob gas accounting is already mutated despite the tx being rejected',
    )
    */


    const postRejectStateRoot = bytesToHex(await vm.stateManager.getStateRoot())
    const cleanStateRoot = bytesToHex(await cleanVm.stateManager.getStateRoot())

    assert.strictEqual(
      postRejectStateRoot,
      cleanStateRoot,
      'runTx side effects must be rolled back when the tx is rejected',
    )


    /**
    const poisonedStateRoot = bytesToHex(await vm.stateManager.getStateRoot())
    const cleanStateRoot = bytesToHex(await cleanVm.stateManager.getStateRoot())
    assert.notStrictEqual(
      poisonedStateRoot,
      cleanStateRoot,
      'runTx side effects must be rolled back when the tx is rejected',
    )
    */

    /** 
    assert.notStrictEqual(
      poisonedStateRoot,
      cleanStateRoot,
      'runTx side effects are already committed into the builder state',
    )
    */


    const { block } = await blockBuilder.build()
    assert.strictEqual(block.transactions.length, 0, 'failing tx is skipped from the payload')
    /** 
    assert.strictEqual(
      block.header.blobGasUsed,
      expectedBlobGasUsed,
      'final block still carries blob gas from the skipped tx',
    )
    */
    //assert.strictEqual(block.header.gasUsed, 0n, 'gas accounting never recorded the skipped tx')
    /**
    assert.strictEqual(
      bytesToHex(block.header.stateRoot),
      poisonedStateRoot,
      'final block seals the poisoned state root',
    )
    */
    assert.strictEqual(block.header.blobGasUsed, 0n)
    assert.strictEqual(block.header.gasUsed, 0n)
    assert.strictEqual(bytesToHex(block.header.stateRoot), cleanStateRoot, 
    'final block must seal the clean state root',)

    await expect(runBlock(cleanVm, { block, skipBlockValidation: true })).resolves.toBeDefined()
  }, 300000)
})