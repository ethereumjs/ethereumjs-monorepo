import { createBlockHeader } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CasperConsensus, EthashConsensus } from '../src/index.ts'

import type { Block } from '@ethereumjs/block'
import type { Blockchain } from '../src/blockchain.ts'

const chainstartCommon = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })

describe('[Blockchain/Casper]: validateDifficulty', () => {
  it('validateDifficulty() rejects non-zero difficulty on PoS blocks', async () => {
    const consensus = new CasperConsensus()
    const header = createBlockHeader(
      {
        difficulty: 1n,
        parentHash: hexToBytes(`0x${'00'.repeat(32)}`),
      },
      { common: chainstartCommon },
    )
    try {
      await consensus.validateDifficulty(header)
      assert.fail('should throw on non-zero PoS difficulty')
    } catch (err: any) {
      assert.include(err.message, 'invalid difficulty')
    }
  })

  it('validateDifficulty() accepts zero difficulty', async () => {
    const consensus = new CasperConsensus()
    const header = createBlockHeader(
      {
        difficulty: 0n,
        parentHash: hexToBytes(`0x${'00'.repeat(32)}`),
      },
      { common: chainstartCommon },
    )
    await consensus.validateDifficulty(header)
  })
})

describe('[Blockchain/Ethash]: validateConsensus', () => {
  it('validateConsensus() rejects invalid PoW', async () => {
    const consensus = new EthashConsensus({
      verifyPOW: async () => false,
    })
    const block = {
      header: createBlockHeader({}, { common: chainstartCommon }),
      hash: () => hexToBytes(`0x${'01'.repeat(32)}`),
    } as Block
    try {
      await consensus.validateConsensus(block)
      assert.fail('should throw on invalid PoW')
    } catch (err: any) {
      assert.include(err.message, 'invalid POW')
    }
  })

  it('validateDifficulty() requires blockchain reference', async () => {
    const consensus = new EthashConsensus({
      verifyPOW: async () => true,
    })
    const header = createBlockHeader({}, { common: chainstartCommon })
    try {
      await consensus.validateDifficulty(header)
      assert.fail('should throw without blockchain')
    } catch (err: any) {
      assert.include(err.message, 'blockchain not provided')
    }
  })

  it('validateDifficulty() rejects wrong canonical difficulty', async () => {
    const parentHeader = createBlockHeader(
      { number: 0n, difficulty: 131072n },
      { common: chainstartCommon },
    )
    const blockchain = {
      _getHeader: async () => parentHeader,
    } as unknown as Blockchain

    const consensus = new EthashConsensus({
      verifyPOW: async () => true,
    })
    await consensus.setup({ blockchain })

    const header = createBlockHeader(
      {
        number: 1n,
        difficulty: 999n,
        parentHash: parentHeader.hash(),
      },
      { common: chainstartCommon },
    )
    try {
      await consensus.validateDifficulty(header)
      assert.fail('should throw on wrong difficulty')
    } catch (err: any) {
      assert.include(err.message, 'invalid difficulty')
    }
  })
})
