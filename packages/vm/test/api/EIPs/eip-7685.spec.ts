import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  DepositRequest,
  KECCAK256_RLP,
  bytesToBigInt,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { VM } from '../../../src/vm.js'
import { setupVM } from '../utils.js'

import type { CLRequest, CLRequestType } from '@ethereumjs/util'

const invalidRequestsRoot = hexToBytes(
  '0xc98048d6605eb79ecc08d90b8817f44911ec474acd8d11688453d2c6ef743bc5'
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
    const emptyBlock = Block.fromBlockData({}, { common })
    const res = await vm.runBlock({
      block: emptyBlock,
      generate: true,
    })
    assert.equal(res.gasUsed, 0n)
  })
  it('should error when an invalid requestsRoot is provided', async () => {
    const vm = await setupVM({ common })

    const emptyBlock = Block.fromBlockData(
      { header: { requestsRoot: invalidRequestsRoot } },
      { common }
    )
    await expect(async () =>
      vm.runBlock({
        block: emptyBlock,
      })
    ).rejects.toThrow('invalid requestsRoot')
  })
  it('should not throw invalid requestsRoot error when valid requests are provided', async () => {
    const vm = await setupVM({ common })
    const request = getRandomDepositRequest()
    const requestsRoot = await Block.genRequestsTrieRoot([request])
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot },
      },
      { common }
    )
    await expect(async () => vm.runBlock({ block })).rejects.toThrow(/invalid requestsRoot/)
  })
  it('should error when requestsRoot does not match requests provided', async () => {
    const vm = await setupVM({ common })
    const request = getRandomDepositRequest()
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot: invalidRequestsRoot },
      },
      { common }
    )
    await expect(() => vm.runBlock({ block })).rejects.toThrow('invalid requestsRoot')
  })
})

describe('EIP 7685 buildBlock tests', () => {
  it('should build a block without a request and a valid requestsRoot', async () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.Cancun,
      eips: [7685, 1559, 4895, 4844, 4788],
    })
    const genesisBlock = Block.fromBlockData(
      { header: { gasLimit: 50000, baseFeePerGas: 100 } },
      { common }
    )
    const blockchain = await Blockchain.create({ genesisBlock, common, validateConsensus: false })
    const vm = await VM.create({ common, blockchain })
    const blockBuilder = await vm.buildBlock({
      parentBlock: genesisBlock,
      blockOpts: { calcDifficultyFromHeader: genesisBlock.header, freeze: false },
    })

    const block = await blockBuilder.build()

    assert.deepEqual(block.header.requestsRoot, KECCAK256_RLP)
  })
})
