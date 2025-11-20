import {
  cliqueEpochTransitionSigners,
  createBlock,
  createSealedCliqueBlock,
} from '@ethereumjs/block'
import {
  Common,
  ConsensusAlgorithm,
  ConsensusType,
  Hardfork,
  createCustomCommon,
} from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'
import { concatBytes, createAddressFromString, createZeroAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CLIQUE_NONCE_AUTH, CLIQUE_NONCE_DROP, CliqueConsensus } from '../src/consensus/clique.ts'
import { createBlockchain } from '../src/index.ts'

import {
  SIGNER_A,
  SIGNER_B,
  SIGNER_C,
  SIGNER_D,
  SIGNER_E,
  SIGNER_F,
  type Signer,
  goerliChainConfig,
} from '@ethereumjs/testdata'

import type { Block } from '@ethereumjs/block'
import type { CliqueConfig } from '@ethereumjs/common'
import type { Blockchain, ConsensusDict } from '../src/index.ts'

const COMMON = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Chainstart })
const EXTRA_DATA = new Uint8Array(97)
const GAS_LIMIT = BigInt(8000000)

const initWithSigners = async (signers: Signer[], common?: Common) => {
  common = common ?? COMMON
  const blocks: Block[] = []

  const extraData = concatBytes(
    new Uint8Array(32),
    ...signers.map((s) => s.address.toBytes()),
    new Uint8Array(65),
  )
  const genesisBlock = createBlock({ header: { gasLimit: GAS_LIMIT, extraData } }, { common })
  blocks.push(genesisBlock)

  const consensusDict: ConsensusDict = {}
  consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()

  const blockchain = await createBlockchain({
    validateBlocks: true,
    validateConsensus: true,
    consensusDict,
    genesisBlock,
    common,
  })
  return { blocks, blockchain }
}

function getBlock(
  blockchain: Blockchain,
  lastBlock: Block,
  signer: Signer,
  beneficiary?: [Signer, boolean],
  checkpointSigners?: Signer[],
  common?: Common,
) {
  common = common ?? COMMON
  const number = lastBlock.header.number + BigInt(1)

  let coinbase = createZeroAddress()
  let nonce = CLIQUE_NONCE_DROP
  let extraData = EXTRA_DATA
  if (beneficiary) {
    coinbase = beneficiary[0].address
    if (beneficiary[1]) {
      nonce = CLIQUE_NONCE_AUTH
    }
  } else if (checkpointSigners) {
    extraData = concatBytes(
      new Uint8Array(32),
      ...checkpointSigners.map((s) => s.address.toBytes()),
      new Uint8Array(65),
    )
  }

  const blockData = {
    header: {
      number,
      parentHash: lastBlock.hash(),
      coinbase,
      timestamp: lastBlock.header.timestamp + BigInt(15),
      extraData,
      gasLimit: GAS_LIMIT,
      difficulty: BigInt(2),
      nonce,
    },
  }

  // calculate difficulty
  const signers = (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(number)
  const signerIndex = signers.findIndex((address: Address) => address.equals(signer.address))
  const inTurn = Number(number) % signers.length === signerIndex
  blockData.header.difficulty = inTurn ? BigInt(2) : BigInt(1)

  // set signer
  const cliqueSigner = signer.privateKey

  return createSealedCliqueBlock(blockData, cliqueSigner, { common })
}

const addNextBlockReorg = async (
  blockchain: Blockchain,
  blocks: Block[],
  forkBlock: Block,
  signer: Signer,
  beneficiary?: [Signer, boolean],
  checkpointSigners?: Signer[],
  common?: Common,
) => {
  const block = getBlock(blockchain, forkBlock, signer, beneficiary, checkpointSigners, common)
  await blockchain.putBlock(block)
  blocks.push(block)
  return block
}

const addNextBlock = async (
  blockchain: Blockchain,
  blocks: Block[],
  signer: Signer,
  beneficiary?: [Signer, boolean],
  checkpointSigners?: Signer[],
  common?: Common,
) => {
  const block = getBlock(
    blockchain,
    blocks[blocks.length - 1],
    signer,
    beneficiary,
    checkpointSigners,
    common,
  )
  await blockchain.putBlock(block)
  blocks.push(block)
  return block
}

describe('Clique: Initialization', () => {
  it('should initialize a clique blockchain', async () => {
    const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Chainstart })
    const consensusDict: ConsensusDict = {}
    consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
    const blockchain = await createBlockchain({ common, consensusDict })

    const head = await blockchain.getIteratorHead()
    assert.deepEqual(head.hash(), blockchain.genesisBlock.hash(), 'correct genesis hash')

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(head.header.number + BigInt(1)),
      cliqueEpochTransitionSigners(head.header),
      'correct genesis signers',
    )
  })

  it('should throw if signer in epoch checkpoint is not active', async () => {
    const { blockchain } = await initWithSigners([SIGNER_A])
    // @ts-expect-error -- Assign to read-only property
    blockchain['_validateBlocks'] = false
    // _validateConsensus needs to be true to trigger this test condition
    // @ts-expect-error -- Assign to read-only property
    blockchain['_validateConsensus'] = true
    const number = (COMMON.consensusConfig() as CliqueConfig).epoch
    const unauthorizedSigner = createAddressFromString('0x00a839de7922491683f547a67795204763ff8237')
    const extraData = concatBytes(
      new Uint8Array(32),
      SIGNER_A.address.toBytes(),
      unauthorizedSigner.toBytes(),
      new Uint8Array(65),
    )
    const block = createSealedCliqueBlock({ header: { number, extraData } }, SIGNER_A.privateKey, {
      common: COMMON,
      freeze: false,
    })
    try {
      await blockchain.putBlock(block)
      assert.fail('should fail')
    } catch (error: any) {
      assert.isTrue(
        error.message.includes('checkpoint signer not found in active signers list'),
        'correct error',
      )
    }
  })

  it('should throw on invalid difficulty', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    const parentHeader = await blockchain.getCanonicalHeadHeader()
    const number = BigInt(2)
    const extraData = new Uint8Array(97)
    let difficulty = BigInt(5)
    let block = createBlock(
      {
        header: {
          number,
          extraData,
          difficulty,
          parentHash: parentHeader.hash(),
          timestamp: parentHeader.timestamp + BigInt(10000),
        },
      },
      { common: COMMON },
    )

    try {
      await blockchain.putBlock(block)
      assert.fail('should fail')
    } catch (error: any) {
      assert.isTrue(
        error.message.includes('difficulty for clique block must be INTURN (2) or NOTURN (1)'),
        'correct error',
      )
    }

    difficulty = BigInt(1)
    const cliqueSigner = SIGNER_A.privateKey
    block = createSealedCliqueBlock(
      {
        header: {
          number,
          extraData,
          difficulty,
          parentHash: parentHeader.hash(),
          timestamp: parentHeader.timestamp + BigInt(10000),
        },
      },
      cliqueSigner,
      { common: COMMON },
    )

    try {
      await blockchain.putBlock(block)
      assert.fail('should fail')
    } catch (error: any) {
      assert.isTrue(error.message.includes('invalid clique difficulty'), 'correct error')
    }
  })

  it("should set the inturn signer's block as canonical block", async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    // when the block number is 1, the inturn signer should be SIGNER_B
    const inturnBlock = await addNextBlock(blockchain, blocks, SIGNER_B)
    blocks.pop()
    // noturn block
    await addNextBlock(blockchain, blocks, SIGNER_A)
    const block = await blockchain.getBlock(1)
    assert.deepEqual(inturnBlock.hash(), block.hash(), 'correct canonical block')
  })

  // Test Cases: https://eips.ethereum.org/EIPS/eip-225
  it('Clique Voting: Single signer, no votes cast', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A])
    const block = await addNextBlock(blockchain, blocks, SIGNER_A)
    assert.strictEqual(block.header.number, BigInt(1))
    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        block.header.number + BigInt(1),
      ),
      [SIGNER_A.address],
    )
  })

  it('Clique Voting: Single signer, voting to add two others', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, true])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
      'only accept first, second needs 2 votes',
    )
  })

  it('Two signers, voting to add three others', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_E, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_E, true])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address, SIGNER_D.address],
      'only accept first two, third needs 3 votes already',
    )
  })

  it('Ensure old clique states are remembered', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_E, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_E, true])
    await addNextBlock(blockchain, blocks, SIGNER_C)

    for (let i = 1; i < blocks.length; i++) {
      await blockchain.putBlock(blocks[i])
    }
  })

  it('Clique Voting: Single signer, dropping itself)', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_A, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [],
      'weird, but one less cornercase by explicitly allowing this',
    )
  })

  it('Clique Voting: Two signers, actually needing mutual consent to drop either of them', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
      'not fulfilled',
    )
  })

  it('Clique Voting: Two signers, actually needing mutual consent to drop either of them', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_B, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address],
      'fulfilled',
    )
  })

  it('Clique Voting: Three signers, two of them deciding to drop the third', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
    )
  })

  it('Clique Voting: Four signers, consensus of two not being enough to drop anyone', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C, SIGNER_D])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address, SIGNER_D.address],
    )
  })

  it('Clique Voting: Four signers, consensus of three already being enough to drop someone', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C, SIGNER_D])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_D, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address],
    )
  })

  it('Clique Voting: Authorizations are counted once per signer per target', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
    )
  })

  it('Clique Voting: Authorizing multiple accounts concurrently is permitted', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address, SIGNER_D.address],
    )
  })

  it('Clique Voting: Deauthorizations are counted once per signer per target', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, false])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, false])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
    )
  })

  it('Clique Voting: Deauthorizing multiple accounts concurrently is permitted', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C, SIGNER_D])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
    )
  })

  it('Clique Voting: Votes from deauthorized signers are discarded immediately', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_B, false])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_B, false])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
      'deauthorized votes',
    )
  })

  it('Clique Voting: Votes from deauthorized signers are discarded immediately', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_D, true])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, true])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
      'auth votes',
    )
  })

  it('Clique Voting: Changes reaching consensus out of bounds (via a deauthorization) execute on touch', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C, SIGNER_D])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_C, true])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
    )
  })

  it('Clique Voting: Changes reaching consensus out of bounds (via a deauthorization) may go out of consensus on first touch', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C, SIGNER_D])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, false])
    await addNextBlock(blockchain, blocks, SIGNER_C)
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_D, false])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true])

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address],
    )
  })

  it("Clique Voting: Ensure that pending votes don't survive authorization status changes", async () => {
    // This corner case can only appear if a signer is quickly added, removed
    // and then re-added (or the inverse), while one of the original voters
    // dropped. If a past vote is left cached in the system somewhere, this
    // will interfere with the final signer outcome.
    const { blocks, blockchain } = await initWithSigners([
      SIGNER_A,
      SIGNER_B,
      SIGNER_C,
      SIGNER_D,
      SIGNER_E,
    ])
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_F, true]) // Authorize SIGNER_F, 3 votes needed
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_F, true])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_F, true])
    await addNextBlock(blockchain, blocks, SIGNER_D, [SIGNER_F, false]) // Deauthorize SIGNER_F, 4 votes needed (leave SIGNER_A's previous vote "unchanged")
    await addNextBlock(blockchain, blocks, SIGNER_E, [SIGNER_F, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_F, false])
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_F, false])
    await addNextBlock(blockchain, blocks, SIGNER_D, [SIGNER_F, true]) // Almost authorize SIGNER_F, 2/3 votes needed
    await addNextBlock(blockchain, blocks, SIGNER_E, [SIGNER_F, true])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_A, false]) // Deauthorize SIGNER_A, 3 votes needed
    await addNextBlock(blockchain, blocks, SIGNER_C, [SIGNER_A, false])
    await addNextBlock(blockchain, blocks, SIGNER_D, [SIGNER_A, false])
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_F, true]) // Finish authorizing SIGNER_F, 3/3 votes needed

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_B.address, SIGNER_C.address, SIGNER_D.address, SIGNER_E.address, SIGNER_F.address],
    )
  })

  it('Clique Voting: Epoch transitions reset all votes to allow chain checkpointing', async () => {
    const common = createCustomCommon(
      {
        consensus: {
          type: ConsensusType.ProofOfAuthority,
          algorithm: ConsensusAlgorithm.Clique,
          clique: {
            period: 15,
            epoch: 3,
          },
        },
      },
      goerliChainConfig,
      {
        hardfork: Hardfork.Chainstart,
      },
    )
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B], common)
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true], undefined, common)
    await addNextBlock(blockchain, blocks, SIGNER_B, undefined, undefined, common)
    await addNextBlock(blockchain, blocks, SIGNER_A, undefined, [SIGNER_A, SIGNER_B], common)
    await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true], undefined, common)

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
    )
  })

  it('Clique Voting: An unauthorized signer should not be able to sign blocks', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    try {
      await addNextBlock(blockchain, blocks, SIGNER_B)
      assert.fail('should throw error')
    } catch (error: any) {
      assert.isTrue(
        error.message.includes('invalid PoA block signature (clique)'),
        'correct error thrown',
      )
    }
  })

  it('Clique Voting: An authorized signer that signed recently should not be able to sign again', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    await addNextBlock(blockchain, blocks, SIGNER_A)
    try {
      await addNextBlock(blockchain, blocks, SIGNER_A)
      assert.fail('should throw error')
    } catch (error: any) {
      assert.isTrue(error.message.includes('recently signed'), 'correct error thrown')
    }
  })

  it('Clique Voting: Recent signatures should not reset on checkpoint blocks imported in a batch', async () => {
    const common = createCustomCommon(
      {
        consensus: {
          type: ConsensusType.ProofOfAuthority,
          algorithm: ConsensusAlgorithm.Clique,
          clique: {
            period: 15,
            epoch: 3,
          },
        },
      },
      goerliChainConfig,
      {
        hardfork: Hardfork.Chainstart,
      },
    )
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C], common)
    await addNextBlock(blockchain, blocks, SIGNER_A, undefined, undefined, common)
    await addNextBlock(blockchain, blocks, SIGNER_B, undefined, undefined, common)
    await addNextBlock(
      blockchain,
      blocks,
      SIGNER_A,
      undefined,
      [SIGNER_A, SIGNER_B, SIGNER_C],
      common,
    )
    try {
      await addNextBlock(blockchain, blocks, SIGNER_A, undefined, undefined, common)
      assert.fail('should throw error')
    } catch (error: any) {
      assert.isTrue(error.message.includes('recently signed'), 'correct error thrown')
    }
  })

  it('cliqueSignerInTurn() -> should work as expected', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B, SIGNER_C])
    // block 1: SIGNER_B, next signer: SIGNER_C
    await addNextBlock(blockchain, blocks, SIGNER_B)
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_A.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_B.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isTrue(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_C.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    // block 2: SIGNER_C, next signer: SIGNER_A
    await addNextBlock(blockchain, blocks, SIGNER_C)
    assert.isTrue(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_A.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_B.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_C.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    // block 3: SIGNER_A, next signer: SIGNER_B
    await addNextBlock(blockchain, blocks, SIGNER_A)
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_A.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isTrue(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_B.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_C.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    // block 4: SIGNER_B, next signer: SIGNER_C
    await addNextBlock(blockchain, blocks, SIGNER_B)
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_A.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isFalse(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_B.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
    assert.isTrue(
      await (blockchain.consensus as CliqueConsensus).cliqueSignerInTurn(
        SIGNER_C.address,
        blocks[blocks.length - 1].header.number,
      ),
    )
  })
})

describe('clique: reorgs', () => {
  it('Two signers, voting to add one other signer, then reorg and revoke this addition', async () => {
    const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
    const genesis = blocks[0]
    await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true])
    const headBlockNotForked = await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true])
    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address],
      'address SIGNER_C added to signers',
    )
    assert.deepEqual((await blockchain.getCanonicalHeadBlock()).hash(), headBlockNotForked.hash())
    await addNextBlockReorg(blockchain, blocks, genesis, SIGNER_B)
    const headBlock = await addNextBlock(blockchain, blocks, SIGNER_A)
    assert.deepEqual((await blockchain.getCanonicalHeadBlock()).hash(), headBlock.hash())
    await addNextBlock(blockchain, blocks, SIGNER_B)
    await addNextBlock(blockchain, blocks, SIGNER_A)

    assert.deepEqual(
      (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
        blocks[blocks.length - 1].header.number + BigInt(1),
      ),
      [SIGNER_A.address, SIGNER_B.address],
      'address SIGNER_C not added to signers',
    )
  })

  /**
   * This test fails, but demonstrates why at an epoch reorg with changing votes, we get an internal error.
  it(
    'Two signers, voting to add one other signer, epoch transition, then reorg and revoke this addition',
    async (st) => {
      const common = createCustomCommon(
        {
          consensus: {
            type: ConsensusType.ProofOfAuthority,
            algorithm: ConsensusAlgorithm.Clique,
            clique: {
              period: 15,
              epoch: 3,
            },
          },
        },
        {
          baseChain: Chain.Rinkeby,
          hardfork: Hardfork.Chainstart,
        }
      )
      const { blocks, blockchain } = await initWithSigners([SIGNER_A, SIGNER_B])
      const genesis = blocks[0]
      await addNextBlock(blockchain, blocks, SIGNER_A, [SIGNER_C, true], undefined, common)
      await addNextBlock(blockchain, blocks, SIGNER_B, [SIGNER_C, true], undefined, common)
      await addNextBlock(blockchain, blocks, SIGNER_A, undefined, undefined, common)
      const headBlockNotForked = await addNextBlock(
        blockchain,
        blocks,
        SIGNER_B,
        undefined,
        undefined,
        common
      )
     assert.deepEqual(
        (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
          blocks[blocks.length - 1].header.number + BigInt(1)
        ),
        [SIGNER_A.address, SIGNER_B.address, SIGNER_C.address],
        'address SIGNER_C added to signers'
      )
     assert.deepEqual((await blockchain.getCanonicalHeadBlock()).hash(), headBlockNotForked.hash())
      await addNextBlockReorg(blockchain, blocks, genesis, SIGNER_B, undefined, undefined, common)
      await addNextBlock(blockchain, blocks, SIGNER_A, undefined, undefined, common)

      // Add block 3: epoch transition
      await addNextBlock(blockchain, blocks, SIGNER_B, undefined, undefined, common)
      // Now here suddenly SIGNER_C is added again as signer

      await addNextBlock(blockchain, blocks, SIGNER_A, undefined, undefined, common)
      await addNextBlock(blockchain, blocks, SIGNER_B, undefined, undefined, common)

      const headBlock = await addNextBlock(blockchain, blocks, SIGNER_A, undefined, undefined, common)
     assert.deepEqual((await blockchain.getCanonicalHeadBlock()).hash(), headBlock.hash())

     assert.deepEqual(
        (blockchain.consensus as CliqueConsensus).cliqueActiveSigners(
          blocks[blocks.length - 1].header.number + BigInt(1)
        ),
        [SIGNER_A.address, SIGNER_B.address],
        'address SIGNER_C not added to signers'
      )

          }
  ) */
})
