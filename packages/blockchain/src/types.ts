import type { Blockchain } from './index.ts'
import type { Block, BlockHeader } from '@ethereumjs/block'
import type { Common, ConsensusAlgorithm } from '@ethereumjs/common'
import type { DB, DBObject, GenesisState } from '@ethereumjs/util'
import type { EventEmitter } from 'eventemitter3'

export type OnBlock = (block: Block, reorg: boolean) => Promise<void> | void

export type BlockchainEvent = {
  deletedCanonicalBlocks: (data: Block[], resolve?: (result?: any) => void) => void
}

export interface BlockchainInterface {
  consensus: Consensus | undefined
  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain.
   */
  putBlock(block: Block): Promise<void>

  /**
   * Deletes a block from the blockchain. All child blocks in the chain are
   * deleted and any encountered heads are set to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   */
  delBlock(blockHash: Uint8Array): Promise<void>

  /**
   * Returns a block by its hash or number.
   */
  getBlock(blockId: Uint8Array | number | bigint): Promise<Block>

  /**
   * Iterates through blocks starting at the specified iterator head and calls
   * the onBlock function on each block.
   *
   * @param name - Name of the state root head
   * @param onBlock - Function called on each block with params (block: Block,
   * @param maxBlocks - optional maximum number of blocks to iterate through
   * reorg: boolean)
   */
  iterator(
    name: string,
    onBlock: OnBlock,
    maxBlocks?: number,
    releaseLockOnCallback?: boolean,
  ): Promise<number>

  /**
   * Returns a shallow copy of the blockchain that may share state with the original
   */
  shallowCopy(): BlockchainInterface

  /**
   * Validates a block header, throwing if invalid. It is being validated against the reported `parentHash`.
   * @param header - header to be validated
   * @param height - If this is an uncle header, this is the height of the block that is including it
   */
  validateHeader(header: BlockHeader, height?: bigint): Promise<void>

  /**
   * Returns the specified iterator head.
   *
   * @param name - Optional name of the iterator head (default: 'vm')
   */
  getIteratorHead(name?: string): Promise<Block>

  /**
   * Set header hash of a certain `tag`.
   * When calling the iterator, the iterator will start running the first child block after the header hash currently stored.
   * @param tag - The tag to save the headHash to
   * @param headHash - The head hash to save
   */
  setIteratorHead(tag: string, headHash: Uint8Array): Promise<void>

  /**
   * Gets total difficulty for a block specified by hash and number
   */
  getTotalDifficulty?(hash: Uint8Array, number?: bigint): Promise<bigint>

  /**
   * Returns the latest full block in the canonical chain.
   */
  getCanonicalHeadBlock(): Promise<Block>

  /**
   * Optional events emitter
   */
  events?: EventEmitter<BlockchainEvent>
}

export interface GenesisOptions {
  /**
   * The blockchain only initializes successfully if it has a genesis block. If
   * there is no block available in the DB and a `genesisBlock` is provided,
   * then the provided `genesisBlock` will be used as genesis. If no block is
   * present in the DB and no block is provided, then the genesis block as
   * provided from the `common` will be used.
   */
  genesisBlock?: Block

  /**
   * If you are using a custom chain {@link Common}, pass the genesis state.
   *
   * Pattern 1 (with genesis state see {@link GenesisState} for format):
   *
   * ```javascript
   * {
   *   '0x0...01': '0x100', // For EoA
   * }
   * ```
   *
   * Pattern 2 (with complex genesis state, containing contract accounts and storage).
   * Note that in {@link AccountState} there are two
   * accepted types. This allows to easily insert accounts in the genesis state:
   *
   * A complex genesis state with Contract and EoA states would have the following format:
   *
   * ```javascript
   * {
   *   '0x0...01': '0x100', // For EoA
   *   '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
   * }
   * ```
   */
  genesisState?: GenesisState

  /**
   * State root of the genesis state
   */
  genesisStateRoot?: Uint8Array
}

export type ConsensusDict = {
  [consensusAlgorithm: ConsensusAlgorithm | string]: Consensus
}

/**
 * This are the options that the Blockchain constructor can receive.
 */
export interface BlockchainOptions extends GenesisOptions {
  /**
   * Specify the chain and hardfork by passing a {@link Common} instance.
   *
   * If not provided this defaults to chain `mainnet` and hardfork `chainstart`
   *
   */
  common?: Common

  /**
   * Set the HF to the fork determined by the head block and update on head updates.
   *
   * Note: for HFs where the transition is also determined by a total difficulty
   * threshold (merge HF) the calculated TD is additionally taken into account
   * for HF determination.
   *
   * Default: `false` (HF is set to whatever default HF is set by the {@link Common} instance)
   */
  hardforkByHeadBlockNumber?: boolean

  /**
   * Database to store blocks and metadata.
   * Can be any database implementation that adheres to the `DB` interface
   */
  db?: DB<Uint8Array | string | number, Uint8Array | string | DBObject>

  /**
   * This flag indicates if protocol-given consistency checks on
   * block headers and included uncles and transactions should be performed,
   * see Block#validate for details.
   *
   */
  validateBlocks?: boolean

  /**
   * Validate the consensus with the respective consensus implementation passed
   * to `consensusDict` (see respective option) `CasperConsensus` (which effectively
   * does nothing) is available by default.
   *
   * For the build-in validation classes the following validations take place.
   * - 'pow' with 'ethash' algorithm (validates the proof-of-work)
   * - 'poa' with 'clique' algorithm (verifies the block signatures)
   * Default: `false`.
   */
  validateConsensus?: boolean

  /**
   * Optional dictionary with consensus objects (adhering to the {@link Consensus} interface)
   * if consensus validation is wished for certain consensus algorithms.
   *
   * Since consensus validation moved to the Ethereum consensus layer with Proof-of-Stake
   * consensus is not validated by default. For `ConsensusAlgorithm.Ethash` and
   * `ConsensusAlgorithm.Clique` consensus validation can be activated by passing in the
   * respective consensus validation objects `EthashConsensus` or `CliqueConsensus`.
   *
   * ```ts
   * import { CliqueConsensus, createBlockchain } from '@ethereumjs/blockchain'
   * import type { ConsensusDict } from '@ethereumjs/blockchain'
   *
   * const consensusDict: ConsensusDict = {}
   * consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
   * const blockchain = await createBlockchain({ common, consensusDict })
   * ```
   *
   * Additionally it is possible to provide a fully custom consensus implementation.
   * Note that this needs a custom `Common` object passed to the blockchain where
   * the `ConsensusAlgorithm` string matches the string used here.
   */
  consensusDict?: ConsensusDict
}

/**
 * Interface that a consensus class needs to implement.
 */
export interface Consensus {
  algorithm: ConsensusAlgorithm | string
  /**
   * Initialize genesis for consensus mechanism
   * @param genesisBlock genesis block
   */
  genesisInit(genesisBlock: Block): Promise<void>

  /**
   * Set up consensus mechanism
   */
  setup({ blockchain }: ConsensusOptions): Promise<void>

  /**
   * Validate block consensus parameters
   * @param block block to be validated
   */
  validateConsensus(block: Block): Promise<void>

  validateDifficulty(header: BlockHeader): Promise<void>

  /**
   * Update consensus on new block
   * @param block new block
   * @param commonAncestor common ancestor block header (optional)
   * @param ancientHeaders array of ancestor block headers (optional)
   */
  newBlock(
    block: Block,
    commonAncestor?: BlockHeader,
    ancientHeaders?: BlockHeader[],
  ): Promise<void>
}

/**
 * Options when initializing a class that implements the Consensus interface.
 */
export interface ConsensusOptions {
  blockchain: Blockchain
}
