import { Hardfork } from '@ethereumjs/common'
import { createTxFromTxData } from '@ethereumjs/tx'
import {
  BIGINT_0,
  BIGINT_256,
  blobsToCommitments,
  commitmentsToVersionedHashes,
  createAddressFromPrivateKey,
  createZeroAddress,
  getBlobs,
  hexToBytes,
} from '@ethereumjs/util'
import { buildBlock } from '@ethereumjs/vm'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import genesisJSON from '../../testdata/geth-genesis/eip4844.json'
import { getRpcClient, setupChain } from '../helpers.js'

import type { Chain } from '../../../src/blockchain/chain.js'
import type { VMExecution } from '../../../src/execution/vmexecution.js'
const method = 'eth_blobBaseFee'

const privateKey = hexToBytes('0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8')
const accountAddress = createAddressFromPrivateKey(privateKey)
const produceBlockWith4844Tx = async (
  execution: VMExecution,
  chain: Chain,
  blobsCount: number[],
) => {
  const kzg = await loadKZG()
  // 4844 sample blob
  const sampleBlob = getBlobs('hello world')
  const commitment = blobsToCommitments(kzg, sampleBlob)
  const blobVersionedHash = commitmentsToVersionedHashes(commitment)

  const { vm } = execution
  const account = await vm.stateManager.getAccount(accountAddress)
  let nonce = account?.nonce ?? BIGINT_0
  const parentBlock = await chain.getCanonicalHeadBlock()
  const vmCopy = await vm.shallowCopy()
  // Set block's gas used to max
  const blockBuilder = await buildBlock(vmCopy, {
    parentBlock,
    headerData: {
      timestamp: parentBlock.header.timestamp + BigInt(1),
    },
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      putBlockIntoBlockchain: false,
    },
  })
  for (let i = 0; i < blobsCount.length; i++) {
    const blobVersionedHashes = []
    const blobs = []
    const kzgCommitments = []
    const to = createZeroAddress()
    if (blobsCount[i] > 0) {
      for (let blob = 0; blob < blobsCount[i]; blob++) {
        blobVersionedHashes.push(...blobVersionedHash)
        blobs.push(...sampleBlob)
        kzgCommitments.push(...commitment)
      }
    }
    await blockBuilder.addTransaction(
      createTxFromTxData(
        {
          type: 3,
          gasLimit: 21000,
          maxFeePerGas: 0xffffffff,
          maxPriorityFeePerGas: BIGINT_256,
          nonce,
          to,
          blobVersionedHashes,
          blobs,
          kzgCommitments,
          maxFeePerBlobGas: BigInt(1000),
        },
        { common: vmCopy.common },
      ).sign(privateKey),
    )
    nonce++
  }

  const block = await blockBuilder.build()
  await chain.putBlocks([block], true)
  await execution.run()
}

describe(method, () => {
  it('call', async () => {
    const kzg = await loadKZG()
    const { server } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
      customCrypto: {
        kzg,
      },
    })

    const rpc = getRpcClient(server)
    const res = await rpc.request(method, [])
    assert.equal(res.result, '0x1')
  })

  it('call with more realistic blockchain', async () => {
    const kzg = await loadKZG()
    const { server, execution, chain } = await setupChain(genesisJSON, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
      customCrypto: {
        kzg,
      },
    })

    for (let i = 0; i < 10; i++) {
      await produceBlockWith4844Tx(execution, chain, [6])
    }
    const rpc = getRpcClient(server)
    const res = await rpc.request(method, [])
    assert.equal(res.result, '0x3')
  })
})
