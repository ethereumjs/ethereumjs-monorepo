import { Address } from 'ethereumjs-util'

export type TStorage = Map<string, Map<string, Buffer>>

export interface TransientStorageModification {
  addr: Address
  key: Buffer
  prevValue: Buffer
}

export type Changeset = TStorage

export interface TransientStorageOptions {
  storage?: TStorage
  changesets?: Changeset[]
}

function copyTransientStorage(input: TStorage): TStorage {
  const map: TStorage = new Map()
  for (const [addr, storage] of input.entries()) {
    const copy = new Map()
    for (const [key, value] of storage.entries()) {
      copy.set(key, value)
    }
    map.set(addr, copy)
  }
  return map
}

/**
 * Merge all the keys from the additional changes into the base, if they aren't already present
 * @param base the base changeset, no keys will be overwritten
 * @param additionalChanges the additional changes that occurred in the nested context
 */
function mergeInto(base: TStorage, additionalChanges: TStorage): void {
  for (const [addr, storage] of additionalChanges.entries()) {
    if (!base.has(addr)) {
      base.set(addr, new Map())
    }
    const map = base.get(addr)!
    for (const [key, value] of storage.entries()) {
      if (!map.has(key)) map.set(key, value)
    }
  }
}

export default class TransientStorage {
  _storage: TStorage
  _changesets: Changeset[]

  constructor(opts: TransientStorageOptions = {}) {
    this._storage = opts.storage ?? new Map()
    this._changesets = opts.changesets ?? [new Map()]
  }

  private get latestChangeset(): Changeset {
    if (this._changesets.length === 0) {
      throw new Error('no changeset initialized')
    }
    return this._changesets[this._changesets.length - 1]
  }

  private recordModification(modification: TransientStorageModification) {
    const latest = this.latestChangeset
    const addrString = modification.addr.toString()
    if (!latest.has(addrString)) {
      latest.set(addrString, new Map())
    }
    const addrMap = latest.get(addrString)!

    const keyString = modification.key.toString('hex')
    // we only need the previous value for the first time the addr-key has been changed since the last checkpoint
    if (!addrMap.has(keyString)) {
      addrMap.set(keyString, modification.prevValue)
    }
  }

  public get(addr: Address, key: Buffer): Buffer {
    const map = this._storage.get(addr.toString())
    if (!map) {
      return Buffer.alloc(32)
    }
    const value = map.get(key.toString('hex'))
    if (!value) {
      return Buffer.alloc(32)
    }
    return value
  }

  public put(addr: Address, key: Buffer, value: Buffer) {
    if (key.length !== 32) {
      throw new Error('Transient storage key must be 32 bytes long')
    }

    if (value.length > 32) {
      throw new Error('Transient storage value cannot be longer than 32 bytes')
    }

    if (!this._storage.has(addr.toString())) {
      this._storage.set(addr.toString(), new Map())
    }
    const map = this._storage.get(addr.toString())!

    const str = key.toString('hex')
    const prevValue = map.get(str) ?? Buffer.alloc(32)

    this.recordModification({
      addr,
      key,
      prevValue,
    })

    map.set(str, value)
  }

  public revert() {
    const changeset = this._changesets.pop()
    if (!changeset) {
      throw new Error('cannot revert without a changeset')
    }

    for (const [addr, map] of changeset.entries()) {
      for (const [key, prevValue] of map.entries()) {
        const storageMap = this._storage.get(addr)!
        storageMap.set(key, prevValue)
      }
    }
  }

  public commit(): void {
    // Don't allow there to be no changeset
    if (this._changesets.length <= 1) {
      throw new Error('trying to commit when not checkpointed')
    }
    const changeset = this._changesets.pop()
    mergeInto(this.latestChangeset, changeset!)
  }

  public checkpoint(): void {
    this._changesets.push(new Map())
  }

  public toJSON(): { [address: string]: { [key: string]: string } } {
    const obj: { [address: string]: { [key: string]: string } } = {}
    for (const [address, map] of this._storage.entries()) {
      obj[address.toString()] = {}
      for (const [key, value] of map.entries()) {
        obj[address.toString()][key] = value.toString('hex')
      }
    }
    return obj
  }

  public clear(): void {
    this._storage = new Map()
    this._changesets = [new Map()]
  }

  public copy(): TransientStorage {
    return new TransientStorage({
      storage: copyTransientStorage(this._storage),
      changesets: this._changesets.slice().map(copyTransientStorage),
    })
  }
}
