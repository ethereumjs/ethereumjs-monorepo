import { createBlockFromBlockData } from '@ethereumjs/block'
import { ChainGenesis } from '@ethereumjs/common'
import { genesisStateRoot as genMerkleGenesisStateRoot } from '@ethereumjs/trie'
import { BIGINT_0, equalsBytes } from '@ethereumjs/util'

import { Blockchain, DBSaveLookups, DBSetBlockOrHeader, DBSetTD } from './index.js'

import type { BlockchainOptions, DBOp } from './index.js'
import type { BlockData } from '@ethereumjs/block'
import type { Chain, Common } from '@ethereumjs/common'
import type { GenesisState } from '@ethereumjs/util'

/**
 * Safe creation of a new Blockchain object awaiting the initialization function,
 * encouraged method to use when creating a blockchain object.
 *
 * @param opts Constructor options, see {@link BlockchainOptions}
 */

/**
 * Verkle or Merkle genesis root
 * @param genesisState
 * @param common
 * @returns
 */
export async function genGenesisStateRoot(
  genesisState: GenesisState,
  common: Common
): Promise<Uint8Array> {
  const genCommon = common.copy()
  genCommon.setHardforkBy({
    blockNumber: 0,
    td: BigInt(genCommon.genesis().difficulty),
    timestamp: genCommon.genesis().timestamp,
  })
  if (genCommon.isActivatedEIP(6800)) {
    throw Error(`Verkle tree state not yet supported`)
  } else {
    return genMerkleGenesisStateRoot(genesisState)
  }
}

/**
 * Returns the genesis state root if chain is well known or an empty state's root otherwise
 */
export async function getGenesisStateRoot(chainId: Chain, common: Common): Promise<Uint8Array> {
  const chainGenesis = ChainGenesis[chainId]
  return chainGenesis !== undefined ? chainGenesis.stateRoot : genGenesisStateRoot({}, common)
}

export async function createBlockchain(opts: BlockchainOptions = {}) {
  const blockchain = new Blockchain(opts)

  await blockchain.consensus.setup({ blockchain })

  let stateRoot = opts.genesisBlock?.header.stateRoot ?? opts.genesisStateRoot
  if (stateRoot === undefined) {
    if (blockchain['_customGenesisState'] !== undefined) {
      stateRoot = await genGenesisStateRoot(blockchain['_customGenesisState'], blockchain.common)
    } else {
      stateRoot = await getGenesisStateRoot(
        Number(blockchain.common.chainId()) as Chain,
        blockchain.common
      )
    }
  }

  const genesisBlock = opts.genesisBlock ?? blockchain.createGenesisBlock(stateRoot)

  let genesisHash = await blockchain.dbManager.numberToHash(BIGINT_0)

  const dbGenesisBlock =
    genesisHash !== undefined ? await blockchain.dbManager.getBlock(genesisHash) : undefined

  // If the DB has a genesis block, then verify that the genesis block in the
  // DB is indeed the Genesis block generated or assigned.
  if (dbGenesisBlock !== undefined && !equalsBytes(genesisBlock.hash(), dbGenesisBlock.hash())) {
    throw new Error(
      'The genesis block in the DB has a different hash than the provided genesis block.'
    )
  }

  genesisHash = genesisBlock.hash()

  if (!dbGenesisBlock) {
    // If there is no genesis block put the genesis block in the DB.
    // For that TD, the BlockOrHeader, and the Lookups have to be saved.
    const dbOps: DBOp[] = []
    dbOps.push(DBSetTD(genesisBlock.header.difficulty, BIGINT_0, genesisHash))
    DBSetBlockOrHeader(genesisBlock).map((op) => dbOps.push(op))
    DBSaveLookups(genesisHash, BIGINT_0).map((op) => dbOps.push(op))
    await blockchain.dbManager.batch(dbOps)
    await blockchain.consensus.genesisInit(genesisBlock)
  }

  // At this point, we can safely set the genesis:
  // it is either the one we put in the DB, or it is equal to the one
  // which we read from the DB.
  blockchain['_genesisBlock'] = genesisBlock

  // load verified iterator heads
  const heads = await blockchain.dbManager.getHeads()
  blockchain['_heads'] = heads !== undefined ? heads : {}

  // load headerchain head
  let hash = await blockchain.dbManager.getHeadHeader()
  blockchain['_headHeaderHash'] = hash !== undefined ? hash : genesisHash

  // load blockchain head
  hash = await blockchain.dbManager.getHeadBlock()
  blockchain['_headBlockHash'] = hash !== undefined ? hash : genesisHash

  if (blockchain['_hardforkByHeadBlockNumber']) {
    const latestHeader = await blockchain['_getHeader'](blockchain['_headHeaderHash'])
    const td = await blockchain.getParentTD(latestHeader)
    await blockchain.checkAndTransitionHardForkByNumber(
      latestHeader.number,
      td,
      latestHeader.timestamp
    )
  }

  return blockchain
}

/**
 * Creates a blockchain from a list of block objects,
 * objects must be readable by {@link Block.fromBlockData}
 *
 * @param blockData List of block objects
 * @param opts Constructor options, see {@link BlockchainOptions}
 */
export async function createBlockchainFromBlocksData(
  blocksData: BlockData[],
  opts: BlockchainOptions = {}
) {
  const blockchain = await createBlockchain(opts)
  for (const blockData of blocksData) {
    const block = createBlockFromBlockData(blockData, {
      common: blockchain.common,
      setHardfork: true,
    })
    await blockchain.putBlock(block)
  }
  return blockchain
}
