// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
import { Block, BlockHeader } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { DBManager } from '../db/manager'

/**
 * Base interface that a consensus class should implement.
 */
export interface ConsensusBase {
  /**
   * Initialize genesis for consensus mechanism
   * @param genesisBlock genesis block
   */
  genesisInit?(genesisBlock: Block): Promise<void>

  /**
   * Set up consensus mechanism
   */
  setup?(): Promise<void>

  /**
   * Validate block
   * @param block block to be validated
   */
  validate?(block: Block): Promise<void>

  /**
   * Update consensus on new block
   * @param block new block
   * @param commonAncestor common ancestor block header
   * @param ancientHeaders array of ancestor block headers
   */
  newBlock?(block: Block, commonAncestor: BlockHeader, ancientHeaders: BlockHeader[]): Promise<void>

  // eslint-disable-next-line
  new(db: LevelUp, dbManager?: DBManager, _common?: Common, _validateConsensus?: boolean): ConsensusBase
}

/**
 * Base class that a consensus class should extend.
 */
export class ConsensusBase implements ConsensusBase {
  db: LevelUp
  dbManager?: DBManager
  _common?: Common
  _validateConsensus?: boolean
  getLatestHeader?: () => Promise<BlockHeader>

  constructor(
    db: LevelUp,
    dbManager?: DBManager,
    _common?: Common,
    _validateConsensus?: boolean,
    getLatestHeader?: () => Promise<BlockHeader>
  ) {
    this.db = db
    this.dbManager = dbManager
    this._common = _common
    this._validateConsensus = _validateConsensus ?? true
    this.getLatestHeader = getLatestHeader
  }

  public async genesisInit?(genesisBlock: Block): Promise<void>
  public async setup?(): Promise<void>
  public async validate?(block: Block): Promise<void>
  public async newBlock?(
    block: Block,
    commonAncestor: BlockHeader,
    ancientHeaders: BlockHeader[]
  ): Promise<void>
}
