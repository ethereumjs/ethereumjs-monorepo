import * as rlp from 'rlp'
import { Address, BN } from 'ethereumjs-util'
import { Block, BlockHeader, BlockBuffer, BlockBodyBuffer } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { CliqueLatestSignerStates, CliqueLatestVotes, CliqueLatestBlockSigners } from '../clique'
import Cache from './cache'
import { DatabaseKey, DBOp, DBTarget, DBOpData } from './operation'

// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'
const level = require('level-mem')

/**
 * @hidden
 */
export interface GetOpts {
  keyEncoding?: string
  valueEncoding?: string
  cache?: string
}

export type CacheMap = { [key: string]: Cache<Buffer> }

/**
 * Abstraction over a DB to facilitate storing/fetching blockchain-related
 * data, such as blocks and headers, indices, and the head block.
 * @hidden
 */
export class DBManager {
  private _cache: CacheMap
  private _common: Common
  private _db: LevelUp

  constructor(db: LevelUp, common: Common) {
    this._db = db
    this._common = common
    this._cache = {
      td: new Cache({ max: 1024 }),
      header: new Cache({ max: 512 }),
      body: new Cache({ max: 256 }),
      numberToHash: new Cache({ max: 2048 }),
      hashToNumber: new Cache({ max: 2048 }),
    }
  }

  /**
   * Fetches iterator heads from the db.
   */
  async getHeads(): Promise<{ [key: string]: Buffer }> {
    const heads = await this.get(DBTarget.Heads)
    Object.keys(heads).forEach((key) => {
      heads[key] = Buffer.from(heads[key])
    })
    return heads
  }

  /**
   * Fetches header of the head block.
   */
  async getHeadHeader(): Promise<Buffer> {
    return this.get(DBTarget.HeadHeader)
  }

  /**
   * Fetches head block.
   */
  async getHeadBlock(): Promise<Buffer> {
    return this.get(DBTarget.HeadBlock)
  }

  /**
   * Fetches clique signers.
   */
  async getCliqueLatestSignerStates(): Promise<CliqueLatestSignerStates> {
    try {
      const signerStates = await this.get(DBTarget.CliqueSignerStates)
      const states = (<any>rlp.decode(signerStates)) as [Buffer, Buffer[]]
      return states.map((state) => {
        const blockNum = new BN(state[0])
        const addrs = (<any>state[1]).map((buf: Buffer) => new Address(buf))
        return [blockNum, addrs]
      }) as CliqueLatestSignerStates
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        return []
      }
      throw error
    }
  }

  /**
   * Fetches clique votes.
   */
  async getCliqueLatestVotes(): Promise<CliqueLatestVotes> {
    try {
      const signerVotes = await this.get(DBTarget.CliqueVotes)
      const votes = (<any>rlp.decode(signerVotes)) as [Buffer, [Buffer, Buffer, Buffer]]
      return votes.map((vote) => {
        const blockNum = new BN(vote[0])
        const signer = new Address((vote[1] as any)[0])
        const beneficiary = new Address((vote[1] as any)[1])
        const nonce = (vote[1] as any)[2]
        return [blockNum, [signer, beneficiary, nonce]]
      }) as CliqueLatestVotes
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        return []
      }
      throw error
    }
  }

  /**
   * Fetches snapshot of clique signers.
   */
  async getCliqueLatestBlockSigners(): Promise<CliqueLatestBlockSigners> {
    try {
      const blockSigners = await this.get(DBTarget.CliqueBlockSigners)
      const signers = (<any>rlp.decode(blockSigners)) as [Buffer, Buffer][]
      return signers.map((s) => {
        const blockNum = new BN(s[0])
        const signer = new Address(s[1] as any)
        return [blockNum, signer]
      }) as CliqueLatestBlockSigners
    } catch (error: any) {
      if (error.type === 'NotFoundError') {
        return []
      }
      throw error
    }
  }

  /**
   * Fetches a block (header and body) given a block id,
   * which can be either its hash or its number.
   */
  async getBlock(blockId: Buffer | BN | number): Promise<Block> {
    if (typeof blockId === 'number' && Number.isInteger(blockId)) {
      blockId = new BN(blockId)
    }

    let number
    let hash
    if (Buffer.isBuffer(blockId)) {
      hash = blockId
      number = await this.hashToNumber(blockId)
    } else if (BN.isBN(blockId)) {
      number = blockId
      hash = await this.numberToHash(blockId)
    } else {
      throw new Error('Unknown blockId type')
    }

    const header = await this.getHeader(hash, number)
    let body: BlockBodyBuffer = [[], []]
    try {
      body = await this.getBody(hash, number)
    } catch (error: any) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }
    const blockData = [header.raw(), ...body] as BlockBuffer
    let parentTd
    if (!number.eqn(0)) {
      parentTd = await this.getTotalDifficulty(header.parentHash, number.subn(1))
    }
    const opts = { common: this._common, hardforkByTD: parentTd }
    return Block.fromValuesArray(blockData, opts)
  }

  /**
   * Fetches body of a block given its hash and number.
   */
  async getBody(blockHash: Buffer, blockNumber: BN): Promise<BlockBodyBuffer> {
    const body = await this.get(DBTarget.Body, { blockHash, blockNumber })
    return rlp.decode(body) as any as BlockBodyBuffer
  }

  /**
   * Fetches header of a block given its hash and number.
   */
  async getHeader(blockHash: Buffer, blockNumber: BN) {
    const encodedHeader = await this.get(DBTarget.Header, { blockHash, blockNumber })
    let parentTd
    if (!blockNumber.eqn(0)) {
      const parentHash = await this.numberToHash(blockNumber.subn(1))
      parentTd = await this.getTotalDifficulty(parentHash, blockNumber.subn(1))
    }
    const opts = { common: this._common, hardforkByTD: parentTd }
    return BlockHeader.fromRLPSerializedHeader(encodedHeader, opts)
  }

  /**
   * Fetches total difficulty for a block given its hash and number.
   */
  async getTotalDifficulty(blockHash: Buffer, blockNumber: BN): Promise<BN> {
    const td = await this.get(DBTarget.TotalDifficulty, { blockHash, blockNumber })
    return new BN(rlp.decode(td))
  }

  /**
   * Performs a block hash to block number lookup.
   */
  async hashToNumber(blockHash: Buffer): Promise<BN> {
    const value = await this.get(DBTarget.HashToNumber, { blockHash })
    return new BN(value)
  }

  /**
   * Performs a block number to block hash lookup.
   */
  async numberToHash(blockNumber: BN): Promise<Buffer> {
    if (blockNumber.ltn(0)) {
      throw new level.errors.NotFoundError()
    }

    return this.get(DBTarget.NumberToHash, { blockNumber })
  }

  /**
   * Fetches a key from the db. If `opts.cache` is specified
   * it first tries to load from cache, and on cache miss will
   * try to put the fetched item on cache afterwards.
   */
  async get(dbOperationTarget: DBTarget, key?: DatabaseKey): Promise<any> {
    const dbGetOperation = DBOp.get(dbOperationTarget, key)

    const cacheString = dbGetOperation.cacheString
    const dbKey = dbGetOperation.baseDBOp.key
    const dbOpts = dbGetOperation.baseDBOp

    if (cacheString) {
      if (!this._cache[cacheString]) {
        throw new Error(`Invalid cache: ${cacheString}`)
      }

      let value = this._cache[cacheString].get(dbKey)
      if (!value) {
        value = <Buffer>await this._db.get(dbKey, dbOpts)
        this._cache[cacheString].set(dbKey, value)
      }

      return value
    }

    return this._db.get(dbKey, dbOpts)
  }

  /**
   * Performs a batch operation on db.
   */
  async batch(ops: DBOp[]) {
    const convertedOps: DBOpData[] = ops.map((op) => op.baseDBOp)
    // update the current cache for each operation
    ops.map((op) => op.updateCache(this._cache))

    return this._db.batch(convertedOps as any)
  }
}
