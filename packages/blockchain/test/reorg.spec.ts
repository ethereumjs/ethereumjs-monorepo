import { cliqueSigner, createBlock } from '@ethereumjs/block'
import { Common, ConsensusAlgorithm, Goerli, Hardfork, Mainnet } from '@ethereumjs/common'
import { Address, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CLIQUE_NONCE_AUTH, CliqueConsensus } from '../src/consensus/clique.js'
import { createBlockchain } from '../src/index.js'

import { generateConsecutiveBlock } from './util.js'

import type { Block } from '@ethereumjs/block'
import type { ConsensusDict } from '../src/index.js'

describe('reorg tests', () => {
  it('should correctly reorg the chain if the total difficulty is higher on a lower block number than the current head block', async () => {
    const common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.MuirGlacier,
    })
    const genesis = createBlock(
      {
        header: {
          number: BigInt(0),
          difficulty: BigInt(0x020000),
          gasLimit: BigInt(8000000),
        },
      },
      { common },
    )

    const blocksLowTd: Block[] = []
    const blocksHighTd: Block[] = []

    blocksLowTd.push(generateConsecutiveBlock(genesis, 0))

    let tdLow = genesis.header.difficulty + blocksLowTd[0].header.difficulty
    let tdHigh = genesis.header.difficulty

    // Keep generating blocks until the Total Difficulty (TD) of the High TD chain is higher than the TD of the Low TD chain
    // This means that the block number of the high TD chain is 1 lower than the low TD chain

    while (tdHigh < tdLow) {
      blocksLowTd.push(generateConsecutiveBlock(blocksLowTd[blocksLowTd.length - 1], 0))
      blocksHighTd.push(
        generateConsecutiveBlock(blocksHighTd[blocksHighTd.length - 1] ?? genesis, 1),
      )

      tdLow += blocksLowTd[blocksLowTd.length - 1].header.difficulty
      tdHigh += blocksHighTd[blocksHighTd.length - 1].header.difficulty
    }

    // sanity check
    const lowTDBlock = blocksLowTd[blocksLowTd.length - 1]
    const highTDBlock = blocksHighTd[blocksHighTd.length - 1]

    const numberLowTd = lowTDBlock.header.number
    const numberHighTd = highTDBlock.header.number

    // ensure that the block difficulty is higher on the highTD chain when compared to the low TD chain
    assert.ok(numberLowTd > numberHighTd, 'low TD should have a lower TD than the reported high TD')
    assert.ok(
      blocksLowTd[blocksLowTd.length - 1].header.number >
        blocksHighTd[blocksHighTd.length - 1].header.number,
      'low TD block should have a higher number than high TD block',
    )
  })

  it('should correctly reorg a poa chain and remove blocks from clique snapshots', async () => {
    const common = new Common({ chain: Goerli, hardfork: Hardfork.Chainstart })
    const genesisBlock = createBlock({ header: { extraData: new Uint8Array(97) } }, { common })

    const consensusDict: ConsensusDict = {}
    consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
    const blockchain = await createBlockchain({
      validateBlocks: false,
      validateConsensus: false,
      consensusDict,
      common,
      genesisBlock,
    })

    const extraData = hexToBytes(
      '0x506172697479205465636820417574686f7269747900000000000000000000002bbf886181970654ed46e3fae0ded41ee53fec702c47431988a7ae80e6576f3552684f069af80ba11d36327aaf846d470526e4a1c461601b2fd4ebdcdc2b734a01',
    ) // from goerli block 1
    const { gasLimit } = genesisBlock.header
    const base = { extraData, gasLimit, difficulty: 1 }

    const nonce = CLIQUE_NONCE_AUTH
    const beneficiary1 = new Address(new Uint8Array(20).fill(1))
    const beneficiary2 = new Address(new Uint8Array(20).fill(2))

    const block1Low = createBlock(
      {
        header: {
          ...base,
          number: 1,
          parentHash: genesisBlock.hash(),
          timestamp: genesisBlock.header.timestamp + BigInt(30),
        },
      },
      { common },
    )
    const block2Low = createBlock(
      {
        header: {
          ...base,
          number: 2,
          parentHash: block1Low.hash(),
          timestamp: block1Low.header.timestamp + BigInt(30),
          nonce,
          coinbase: beneficiary1,
        },
      },
      { common },
    )

    const block1High = createBlock(
      {
        header: {
          ...base,
          number: 1,
          parentHash: genesisBlock.hash(),
          timestamp: genesisBlock.header.timestamp + BigInt(15),
        },
      },
      { common },
    )
    const block2High = createBlock(
      {
        header: {
          ...base,
          number: 2,
          parentHash: block1High.hash(),
          timestamp: block1High.header.timestamp + BigInt(15),
        },
      },
      { common },
    )
    const block3High = createBlock(
      {
        header: {
          ...base,
          number: 3,
          parentHash: block2High.hash(),
          timestamp: block2High.header.timestamp + BigInt(15),
          nonce,
          coinbase: beneficiary2,
        },
      },
      { common },
    )

    await blockchain.putBlocks([block1Low, block2Low])

    await blockchain.putBlocks([block1High, block2High, block3High])

    let signerStates = (blockchain.consensus as CliqueConsensus)._cliqueLatestSignerStates

    assert.ok(
      !signerStates.find(
        (s: any) => s[0] === BigInt(2) && s[1].find((a: Address) => a.equals(beneficiary1)),
      ),
      'should not find reorged signer state',
    )

    let signerVotes = (blockchain.consensus as CliqueConsensus)._cliqueLatestVotes
    assert.ok(
      !signerVotes.find(
        (v: any) =>
          v[0] === BigInt(2) &&
          v[1][0].equal(cliqueSigner(block1Low.header)) &&
          v[1][1].equal(beneficiary1) &&
          equalsBytes(v[1][2], CLIQUE_NONCE_AUTH),
      ),
      'should not find reorged clique vote',
    )

    let blockSigners = (blockchain.consensus as CliqueConsensus)._cliqueLatestBlockSigners
    assert.ok(
      !blockSigners.find(
        (s: any) => s[0] === BigInt(1) && s[1].equal(cliqueSigner(block1Low.header)),
      ),
      'should not find reorged block signer',
    )

    signerStates = (blockchain.consensus as CliqueConsensus)._cliqueLatestSignerStates
    assert.ok(
      !!signerStates.find(
        (s: any) => s[0] === BigInt(3) && s[1].find((a: Address) => a.equals(beneficiary2)),
      ),
      'should find reorged signer state',
    )

    signerVotes = (blockchain.consensus as CliqueConsensus)._cliqueLatestVotes
    assert.ok(signerVotes.length === 0, 'votes should be empty')

    blockSigners = (blockchain.consensus as CliqueConsensus)._cliqueLatestBlockSigners
    assert.ok(
      !!blockSigners.find(
        (s: any) => s[0] === BigInt(3) && s[1].equals(cliqueSigner(block3High.header)),
      ),
      'should find reorged block signer',
    )
  })
})
