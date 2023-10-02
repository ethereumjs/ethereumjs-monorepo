import {
  Account,
  KECCAK256_NULL,
  bytesToHex,
  bytesToUnprefixedHex,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import debugDefault from 'debug'
import { keccak256 } from 'ethereum-cryptography/keccak'

import { LevelDB } from '../execution/level'

import type { Address } from '@ethereumjs/util'
import type { Debugger } from 'debug'
import type { Level } from 'level'

const ACCOUNT_PREFIX: Uint8Array = hexToBytes('00')
const STORAGE_PREFIX: Uint8Array = hexToBytes('11')
const CODE_PREFIX: Uint8Array = hexToBytes('22')
const CHECKPOINT_PREFIX: Uint8Array = hexToBytes('33')

const { debug: createDebugLogger } = debugDefault

type SnapshotElement = {
  data: Uint8Array | undefined
}

// function concatenateUint8Arrays(array1: Uint8Array, array2: Uint8Array) {
//   const concatenatedArray = new Uint8Array(array1.length + array2.length)

//   concatenatedArray.set(array1, 0) // Copy array1 to the beginning of concatenatedArray
//   concatenatedArray.set(array2, array1.length) // Copy array2 after array1 in concatenatedArray

//   return concatenatedArray
// }

function concatenateUint8Arrays(arrays: Uint8Array[]) {
  const l = arrays.reduce((prev, curr) => prev + curr.length, 0)
  const concatenatedArray = new Uint8Array(l)

  let offset = 0
  for (const array of arrays) {
    concatenatedArray.set(array, offset)
    offset += array.length
  }

  return concatenatedArray
}

// TODO don't extend Cache
export class Snapshot extends Cache {
  _db: LevelDB<Uint8Array, Uint8Array>
  _debug: Debugger
  _checkpoints = 0

  /**
   * Diff cache collecting the state of the cache
   * at the beginning of checkpoint height
   * (respectively: before a first modification)
   *
   * If the whole cache element is undefined (in contrast
   * to the account), the element didn't exist in the cache
   * before.
   */
  _diffCache: Map<string, SnapshotElement | undefined>[] = []
  constructor(db: Level<string | Uint8Array, string | Uint8Array>) {
    super()
    this._db = new LevelDB<Uint8Array, Uint8Array>(db)
    this._diffCache.push(new Map<string, SnapshotElement | undefined>())
    this._debug = createDebugLogger('client:snapshot')
  }

  async _saveCachePreState(key: Uint8Array) {
    const keyHex = bytesToHex(key)
    const it = this._diffCache[this._checkpoints].get(keyHex)
    if (it === undefined) {
      const oldElem: SnapshotElement | undefined = {
        data: (await this._db.get(key)) as Uint8Array | undefined,
      }
      this._diffCache[this._checkpoints].set(keyHex, oldElem)
    }
  }

  async putAccount(address: Address, account: Account): Promise<void> {
    const addressHex = address.bytes
    const key = concatenateUint8Arrays([ACCOUNT_PREFIX, keccak256(addressHex)])
    const value = account.serialize()
    await this._saveCachePreState(key)

    await this._db.put(key, value)
  }

  async getAccount(address: Address): Promise<Uint8Array | undefined> {
    const addressHex = address.bytes
    const key = concatenateUint8Arrays([ACCOUNT_PREFIX, keccak256(addressHex)])

    return this._db.get(key)
  }

  async delAccount(address: Address): Promise<void> {
    const addressHex = address.bytes
    const key = concatenateUint8Arrays([ACCOUNT_PREFIX, keccak256(addressHex)])
    await this._saveCachePreState(key)

    return this._db.del(key)
  }

  /**
   * Deletes not only the account itself, but also the code
   * and any storage items if available.
   */
  async clearAccount(address: Address): Promise<void> {
    const rawAccount = await this.getAccount(address)
    if (rawAccount === undefined) return

    await this.delAccount(address)

    const account = Account.fromRlpSerializedAccount(rawAccount)
    if (!equalsBytes(account.codeHash, KECCAK256_NULL)) {
      // await this.delCode(account.codeHash)
    }

    await this.clearAccountStorage(address)
  }

  async putStorageSlot(address: Address, slot: Uint8Array, value: Uint8Array): Promise<void> {
    const key = concatenateUint8Arrays([STORAGE_PREFIX, keccak256(address.bytes), keccak256(slot)])
    await this._saveCachePreState(key)
    await this._db.put(key, value)
  }

  async getStorageSlot(address: Address, slot: Uint8Array): Promise<Uint8Array | undefined> {
    const key = concatenateUint8Arrays([STORAGE_PREFIX, keccak256(address.bytes), keccak256(slot)])
    return this._db.get(key)
  }

  async delStorageSlot(address: Address, slot: Uint8Array): Promise<void> {
    const key = concatenateUint8Arrays([STORAGE_PREFIX, keccak256(address.bytes), keccak256(slot)])
    await this._saveCachePreState(key)
    await this._db.del(key)
  }

  async clearAccountStorage(address: Address): Promise<void> {
    const prefix = concatenateUint8Arrays([STORAGE_PREFIX, keccak256(address.bytes)])
    const keys = await this._db.keysByPrefix(prefix)
    for (const key of keys) await this._saveCachePreState(key)
    await this._db.delByPrefix(prefix)
  }

  // /**
  //  * Puts account to cache under its address.
  //  * @param address - Address of account
  //  * @param account - Account or undefined if account doesn't exist in the trie
  //  */
  // put(address: Address, account: Account | undefined): void {
  //   const addressHex = bytesToUnprefixedHex(address.bytes)
  //   this._saveCachePreState(addressHex)
  //   const elem = {
  //     data: account !== undefined ? account.serialize() : undefined,
  //   }

  //   if (this.DEBUG) {
  //     this._debug(`Put account ${addressHex}`)
  //   }
  //   if (this._lruCache) {
  //     this._lruCache!.set(addressHex, elem)
  //   } else {
  //     this._orderedMapCache!.setElement(addressHex, elem)
  //   }
  //   this._stats.writes += 1
  // }

  // /**
  //  * Returns the queried account or undefined if account doesn't exist
  //  * @param address - Address of account
  //  */
  // get(address: Address): SnapshotElement | undefined {
  //   const addressHex = bytesToUnprefixedHex(address.bytes)
  //   if (this.DEBUG) {
  //     this._debug(`Get account ${addressHex}`)
  //   }

  //   let elem: SnapshotElement | undefined
  //   if (this._lruCache) {
  //     elem = this._lruCache!.get(addressHex)
  //   } else {
  //     elem = this._orderedMapCache!.getElementByKey(addressHex)
  //   }
  //   this._stats.reads += 1
  //   if (elem) {
  //     this._stats.hits += 1
  //   }
  //   return elem
  // }

  // /**
  //  * Marks address as deleted in cache.
  //  * @param address - Address
  //  */
  // del(address: Address): void {
  //   const addressHex = bytesToUnprefixedHex(address.bytes)
  //   this._saveCachePreState(addressHex)
  //   if (this.DEBUG) {
  //     this._debug(`Delete account ${addressHex}`)
  //   }
  //   if (this._lruCache) {
  //     this._lruCache!.set(addressHex, {
  //       data: undefined,
  //     })
  //   } else {
  //     this._orderedMapCache!.setElement(addressHex, {
  //       data: undefined,
  //     })
  //   }

  //   this._stats.dels += 1
  // }

  /**
   * Flushes cache by returning accounts that have been modified
   * or deleted and resetting the diff cache (at checkpoint height).
   */
  flush(): [string, SnapshotElement][] {
    if (this.DEBUG) {
      this._debug(`Flushing cache on checkpoint ${this._checkpoints}`)
    }

    const diffMap = this._diffCache[this._checkpoints]!

    const items: [string, SnapshotElement][] = []

    for (const entry of diffMap.entries()) {
      const cacheKeyHex = entry[0]
      let elem: SnapshotElement | undefined
      if (this._lruCache) {
        elem = this._lruCache!.get(cacheKeyHex)
      } else {
        elem = this._orderedMapCache!.getElementByKey(cacheKeyHex)
      }

      if (elem !== undefined) {
        items.push([cacheKeyHex, elem])
      }
    }
    this._diffCache[this._checkpoints] = new Map<string, SnapshotElement | undefined>()
    return items
  }

  /**
   * Revert changes to cache last checkpoint (no effect on trie).
   */
  revert(): void {
    this._checkpoints -= 1
    if (this.DEBUG) {
      this._debug(`Revert to checkpoint ${this._checkpoints}`)
    }
    const diffMap = this._diffCache.pop()!
    for (const entry of diffMap.entries()) {
      const addressHex = entry[0]
      const elem = entry[1]
      if (elem === undefined) {
        if (this._lruCache) {
          this._lruCache!.delete(addressHex)
        } else {
          this._orderedMapCache!.eraseElementByKey(addressHex)
        }
      } else {
        if (this._lruCache) {
          this._lruCache!.set(addressHex, elem)
        } else {
          this._orderedMapCache!.setElement(addressHex, elem)
        }
      }
    }
  }

  /**
   * Commits to current state of cache (no effect on trie).
   */
  commit(): void {
    this._checkpoints -= 1
    if (this.DEBUG) {
      this._debug(`Commit to checkpoint ${this._checkpoints}`)
    }
    const diffMap = this._diffCache.pop()!
    for (const entry of diffMap.entries()) {
      const addressHex = entry[0]
      const oldEntry = this._diffCache[this._checkpoints].has(addressHex)
      if (!oldEntry) {
        const elem = entry[1]
        this._diffCache[this._checkpoints].set(addressHex, elem)
      }
    }
  }

  /**
   * Marks current state of cache as checkpoint, which can
   * later on be reverted or committed.
   */
  checkpoint(): void {
    this._checkpoints += 1
    if (this.DEBUG) {
      this._debug(`New checkpoint ${this._checkpoints}`)
    }
    this._diffCache.push(new Map<string, SnapshotElement | undefined>())
  }

  // /**
  //  * Returns the size of the cache
  //  * @returns
  //  */
  // size() {
  //   if (this._lruCache) {
  //     return this._lruCache!.size
  //   } else {
  //     return this._orderedMapCache!.size()
  //   }
  // }

  // /**
  //  * Returns a dict with cache stats
  //  * @param reset
  //  */
  // stats(reset = true) {
  //   const stats = { ...this._stats }
  //   stats.size = this.size()
  //   if (reset) {
  //     this._stats = {
  //       size: 0,
  //       reads: 0,
  //       hits: 0,
  //       writes: 0,
  //       dels: 0,
  //     }
  //   }
  //   return stats
  // }

  /**
   * Clears cache.
   */
  clear(): void {
    if (this.DEBUG) {
      this._debug(`Clear cache`)
    }
    if (this._lruCache) {
      this._lruCache!.clear()
    } else {
      this._orderedMapCache!.clear()
    }
  }
}
