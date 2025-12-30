import { Hardfork } from '@ethereumjs/common'
import { eip4844GethGenesis } from '@ethereumjs/testdata'
import { createTx } from '@ethereumjs/tx'
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
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, it } from 'vitest'

import { getRPCClient, setupChain } from '../helpers.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { Chain } from '../../../src/blockchain/chain.ts'
import type { VMExecution } from '../../../src/execution/vmexecution.ts'

const method = 'eth_blobBaseFee'
const kzg = new microEthKZG(trustedSetup)
const privateKey = hexToBytes('0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8')
const accountAddress = createAddressFromPrivateKey(privateKey)
const produceBlockWith4844Tx = async (
  execution: VMExecution,
  chain: Chain,
  blobsCount: number[],
) => {
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
    const blobVersionedHashes = [] as PrefixedHexString[]
    const blobs = [] as PrefixedHexString[]
    const kzgCommitments = [] as PrefixedHexString[]
    const to = createZeroAddress()
    if (blobsCount[i] > 0) {
      for (let blob = 0; blob < blobsCount[i]; blob++) {
        blobVersionedHashes.push(...blobVersionedHash)
        blobs.push(...sampleBlob)
        kzgCommitments.push(...commitment)
      }
    }
    await blockBuilder.addTransaction(
      createTx(
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

  const { block } = await blockBuilder.build()
  await chain.putBlocks([block], true)
  await execution.run()
}

describe(method, () => {
  it('call', async () => {
    const { server } = await setupChain(eip4844GethGenesis, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
      customCrypto: {
        kzg,
      },
    })

    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x1')
  })

  it('call with more realistic blockchain', async () => {
    const { server, execution, chain } = await setupChain(eip4844GethGenesis, 'post-merge', {
      engine: true,
      hardfork: Hardfork.Cancun,
      customCrypto: {
        kzg,
      },
    })

    for (let i = 0; i < 2; i++) {
      await produceBlockWith4844Tx(execution, chain, [3])
    }
    const rpc = getRPCClient(server)
    const res = await rpc.request(method, [])
    assert.strictEqual(res.result, '0x1')
  }, 30000)
})
