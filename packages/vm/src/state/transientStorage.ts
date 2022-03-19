import { Address } from 'ethereumjs-util'

export type TStorage = Map<string, Map<string, Buffer>>

export interface TransientStorageModification {
  addr: Address
  key: Buffer
  prevValue: Buffer
}

export type Changeset = TransientStorageModification[]

export interface TransientStorageOptions {
  storage?: TStorage
  changesets?: Changeset[]
}

export default class TransientStorage {
  _storage: TStorage
  _changesets: Changeset[]

  constructor(opts: TransientStorageOptions = {}) {
    this._storage = opts.storage ?? new Map()
    this._changesets = opts.changesets ?? [[]]
  }

  private addModification(modification: TransientStorageModification) {
    if (this._changesets.length === 0) {
      throw new Error('no changeset initialized')
    }
    const latest = this._changesets[this._changesets.length - 1]
    latest.push(modification)
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

    this.addModification({
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
    for (let i = changeset.length - 1; i >= 0; i--) {
      const modification = changeset[i]
      const map = this._storage.get(modification.addr.toString())!
      map.set(modification.key.toString('hex'), modification.prevValue)
    }
  }

  public commit(): void {
    // Don't allow there to be no changeset
    if (this._changesets.length <= 1) {
      throw new Error('trying to commit when not checkpointed')
    }
    this._changesets.pop()
  }

  public checkpoint(): void {
    this._changesets.push([])
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
    this._changesets = [[]]
  }

  public copy(): TransientStorage {
    return new TransientStorage({
      storage: copyTransientStorage(this._storage),
      changesets: this._changesets.slice(),
    })
  }
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
