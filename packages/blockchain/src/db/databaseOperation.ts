import { BN } from 'ethereumjs-util'
import {
  HEADS_KEY,
  HEAD_HEADER_KEY,
  HEAD_BLOCK_KEY,
  tdKey,
  headerKey,
  bodyKey,
  numberToHashKey,
  hashToNumberKey,
} from './dbConstants'

import { CacheMap } from './dbManager'

export enum DatabaseOperationTarget {
  Heads,
  HeadHeader,
  HeadBlock,
  HashToNumber,
  NumberToHash,
  TotalDifficulty,
  Body,
  Header,
}

/**
 * @hidden
 */
export interface DBOp {
  type?: String
  key: Buffer | string
  keyEncoding: String
  valueEncoding?: String
  value?: Buffer | object
}

// a Database Key is identified by a block hash, a block number, or both
export type DatabaseKey = {
  blockNumber?: BN
  blockHash?: Buffer
}

export class DatabaseOperation {
  public operationTarget: DatabaseOperationTarget
  public baseDBOp: DBOp
  public cacheString: string | undefined

  private constructor(operationTarget: DatabaseOperationTarget, key?: DatabaseKey) {
    this.operationTarget = operationTarget

    this.baseDBOp = {
      key: '',
      keyEncoding: 'binary',
      valueEncoding: 'binary',
    }

    switch (operationTarget) {
      case DatabaseOperationTarget.Heads: {
        this.baseDBOp.key = HEADS_KEY
        this.baseDBOp.valueEncoding = 'json'
        break
      }
      case DatabaseOperationTarget.HeadHeader: {
        this.baseDBOp.key = HEAD_HEADER_KEY
        break
      }
      case DatabaseOperationTarget.HeadBlock: {
        this.baseDBOp.key = HEAD_BLOCK_KEY
        break
      }
      case DatabaseOperationTarget.HashToNumber: {
        this.baseDBOp.key = hashToNumberKey(key!.blockHash!)
        this.cacheString = 'hashToNumber'
        break
      }
      case DatabaseOperationTarget.NumberToHash: {
        this.baseDBOp.key = numberToHashKey(key!.blockNumber!)
        this.cacheString = 'numberToHash'
        break
      }
      case DatabaseOperationTarget.TotalDifficulty: {
        this.baseDBOp.key = tdKey(key!.blockNumber!, key!.blockHash!)
        this.cacheString = 'td'
        break
      }
      case DatabaseOperationTarget.Body: {
        this.baseDBOp.key = bodyKey(key!.blockNumber!, key!.blockHash!)
        this.cacheString = 'body'
        break
      }
      case DatabaseOperationTarget.Header: {
        this.baseDBOp.key = headerKey(key!.blockNumber!, key!.blockHash!)
        this.cacheString = 'header'
        break
      }
    }
  }

  public static get(
    operationTarget: DatabaseOperationTarget,
    key?: DatabaseKey
  ): DatabaseOperation {
    return new DatabaseOperation(operationTarget, key)
  }

  // set operation: note: value/key is not in default order
  public static set(
    operationTarget: DatabaseOperationTarget,
    value: Buffer | object,
    key?: DatabaseKey
  ): DatabaseOperation {
    const databaseOperation = new DatabaseOperation(operationTarget, key)
    databaseOperation.baseDBOp.value = value
    databaseOperation.baseDBOp.type = 'put'

    if (operationTarget == DatabaseOperationTarget.Heads) {
      databaseOperation.baseDBOp.valueEncoding = 'json'
    } else {
      databaseOperation.baseDBOp.valueEncoding = 'binary'
    }

    return databaseOperation
  }

  public static del(
    operationTarget: DatabaseOperationTarget,
    key?: DatabaseKey
  ): DatabaseOperation {
    const databaseOperation = new DatabaseOperation(operationTarget, key)
    databaseOperation.baseDBOp.type = 'del'
    return databaseOperation
  }

  public updateCache(cacheMap: CacheMap) {
    if (this.cacheString && cacheMap[this.cacheString] && Buffer.isBuffer(this.baseDBOp.value)) {
      if (this.baseDBOp.type == 'put') {
        cacheMap[this.cacheString].set(this.baseDBOp.key, this.baseDBOp.value)
      } else if (this.baseDBOp.type == 'del') {
        cacheMap[this.cacheString].del(this.baseDBOp.key)
      } else {
        throw new Error('unsupported db operation on cache')
      }
    }
  }
}
