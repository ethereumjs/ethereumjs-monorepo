import { createBlock, genRequestsRoot } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createCLRequest, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { sha256 } from '@noble/hashes/sha2.js'
import { assert, describe, expect, it } from 'vitest'

import { buildBlock, createVM, runBlock } from '../../../src/index.ts'
import { setupVM } from '../utils.ts'

import type { CLRequest, CLRequestType } from '@ethereumjs/util'

const invalidRequestsRoot = hexToBytes(
  '0xc98048d6605eb79ecc08d90b8817f44911ec474acd8d11688453d2c6ef743bc5',
)
function getRandomDepositRequest(): CLRequest<CLRequestType> {
  const sampleDepositRequest = hexToBytes(
    '0x00ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030040597307000000a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d7690000000000000000',
  )
  return createCLRequest(sampleDepositRequest)
}

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7685] })

describe('EIP-7685 runBlock tests', () => {
  it('should not error when a valid requestsHash is provided', async () => {
    const vm = await setupVM({ common })
    const emptyBlock = createBlock({}, { common })
    const res = await runBlock(vm, {
      block: emptyBlock,
      generate: true,
    })
    assert.strictEqual(res.gasUsed, 0n)
    // Verify that if the requests are empty, the byte-types are not appended to the to-be-hashed flat array
    // I.e. the flat array to-be-hashed is not `0x 00 01 02`, but is now the empty bytes array, `0x`
    assert.isTrue(equalsBytes(res.requestsHash!, sha256(new Uint8Array())))
  })
  it('should error when an invalid requestsHash is provided', async () => {
    const vm = await setupVM({ common })

    const emptyBlock = createBlock({ header: { requestsHash: invalidRequestsRoot } }, { common })
    await expect(async () =>
      runBlock(vm, {
        block: emptyBlock,
      }),
    ).rejects.toThrow('invalid requestsHash')
  })
  it('should not throw invalid requestsHash error when valid requests are provided', async () => {
    const vm = await setupVM({ common })
    const request = getRandomDepositRequest()
    const requestsHash = genRequestsRoot([request], sha256)
    const block = createBlock(
      {
        header: { requestsHash },
      },
      { common },
    )
    await expect(async () => runBlock(vm, { block })).rejects.toThrow(/invalid requestsHash/)
  })

  // TODO: no way to test this without running block, why check why does this test pass
  // as it should not throw on some random request root
  it('should error when requestsHash does not match requests provided', async () => {
    const vm = await setupVM({ common })
    const block = createBlock(
      {
        header: { requestsHash: invalidRequestsRoot },
      },
      { common },
    )
    await expect(() => runBlock(vm, { block })).rejects.toThrow('invalid requestsHash')
  })
})

describe('EIP 7685 buildBlock tests', () => {
  it('should build a block without a request and a valid requestsHash', async () => {
    const common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Cancun,
      eips: [7685, 1559, 4895, 4844, 4788],
    })
    const genesisBlock = createBlock(
      { header: { gasLimit: 50000, baseFeePerGas: 100 } },
      { common },
    )
    const blockchain = await createBlockchain({ genesisBlock, common, validateConsensus: false })
    const vm = await createVM({ common, blockchain })
    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      blockOpts: { calcDifficultyFromHeader: genesisBlock.header, freeze: false },
    })

    const { block } = await blockBuilder.build()

    assert.deepEqual(
      block.header.requestsHash,
      hexToBytes('0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
    )
  })
})
