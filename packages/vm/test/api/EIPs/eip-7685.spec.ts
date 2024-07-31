import { createBlock, genRequestsTrieRoot } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  DepositRequest,
  KECCAK256_RLP,
  bytesToBigInt,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { VM, buildBlock, runBlock } from '../../../src/index.js'
import { setupVM } from '../utils.js'

import type { CLRequest, CLRequestType } from '@ethereumjs/util'

const invalidRequestsRoot = hexToBytes(
  '0xc98048d6605eb79ecc08d90b8817f44911ec474acd8d11688453d2c6ef743bc5',
)
function getRandomDepositRequest(): CLRequest<CLRequestType> {
  const depositRequestData = {
    pubkey: randomBytes(48),
    withdrawalCredentials: randomBytes(32),
    amount: bytesToBigInt(randomBytes(8)),
    signature: randomBytes(96),
    index: bytesToBigInt(randomBytes(8)),
  }
  return DepositRequest.fromRequestData(depositRequestData) as CLRequest<CLRequestType>
}

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [7685] })

describe('EIP-7685 runBlock tests', () => {
  it('should not error when a valid requestsRoot is provided', async () => {
    const vm = await setupVM({ common })
    const emptyBlock = createBlock({}, { common })
    const res = await runBlock(vm, {
      block: emptyBlock,
      generate: true,
    })
    assert.equal(res.gasUsed, 0n)
  })
  it('should error when an invalid requestsRoot is provided', async () => {
    const vm = await setupVM({ common })

    const emptyBlock = createBlock({ header: { requestsRoot: invalidRequestsRoot } }, { common })
    await expect(async () =>
      runBlock(vm, {
        block: emptyBlock,
      }),
    ).rejects.toThrow('invalid requestsRoot')
  })
  it('should not throw invalid requestsRoot error when valid requests are provided', async () => {
    const vm = await setupVM({ common })
    const request = getRandomDepositRequest()
    const requestsRoot = await genRequestsTrieRoot([request])
    const block = createBlock(
      {
        requests: [request],
        header: { requestsRoot },
      },
      { common },
    )
    await expect(async () => runBlock(vm, { block })).rejects.toThrow(/invalid requestsRoot/)
  })
  it('should error when requestsRoot does not match requests provided', async () => {
    const vm = await setupVM({ common })
    const request = getRandomDepositRequest()
    const block = createBlock(
      {
        requests: [request],
        header: { requestsRoot: invalidRequestsRoot },
      },
      { common },
    )
    await expect(() => runBlock(vm, { block })).rejects.toThrow('invalid requestsRoot')
  })
})

describe('EIP 7685 buildBlock tests', () => {
  it('should build a block without a request and a valid requestsRoot', async () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.Cancun,
      eips: [7685, 1559, 4895, 4844, 4788],
    })
    const genesisBlock = createBlock(
      { header: { gasLimit: 50000, baseFeePerGas: 100 } },
      { common },
    )
    const blockchain = await createBlockchain({ genesisBlock, common, validateConsensus: false })
    const vm = await VM.create({ common, blockchain })
    const blockBuilder = await buildBlock(vm, {
      parentBlock: genesisBlock,
      blockOpts: { calcDifficultyFromHeader: genesisBlock.header, freeze: false },
    })

    const block = await blockBuilder.build()

    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
  })
})
