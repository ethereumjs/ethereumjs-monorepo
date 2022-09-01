import { Account } from '@ethereumjs/util'

import type { Address } from '@ethereumjs/util'

export class StateCache {
  _storage: Map<string, Map<string, Buffer>>[]
  _accounts: Map<string, Account>[]
  _warmAddresses: Set<string>[]
  _warmSlots: Map<string, Set<string>>[]
  _codeHash: Map<string, Buffer>

  get storage() {
    return this._storage[this._storage.length - 1]
  }

  get accounts() {
    return this._accounts[this._accounts.length - 1]
  }

  get warmAddresses() {
    return this._warmAddresses[this._warmAddresses.length - 1]
  }

  get warmSlots() {
    return this._warmSlots[this._warmSlots.length - 1]
  }

  constructor() {
    this._storage = [new Map<string, Map<string, Buffer>>()]
    this._accounts = [new Map<string, Account>()]
    this._warmAddresses = [new Set<string>()]
    this._warmSlots = [new Map<string, Set<string>>()]
    this._codeHash = new Map<string, Buffer>()
  }

  setCode(code: Buffer, hash: Buffer) {
    this._codeHash.set(hash.toString('hex'), code)
  }

  getCode(hash: Buffer) {
    return this._codeHash.get(hash.toString('hex'))
  }

  getStorage(address: Address, slot: Buffer): Buffer {
    let i = this._storage.length - 1
    const key = address.toString()
    const slotKey = slot.toString('hex')
    while (i >= 0) {
      const storageMap = this._storage[i].get(key)
      if (storageMap) {
        if (storageMap.has(slotKey)) {
          return storageMap.get(slotKey)!
        }
      }
      i--
    }
    return Buffer.alloc(0)
  }

  getAccount(address: Address, reportUndefined = false): Account | undefined {
    let i = this._warmAddresses.length - 1
    const key = address.toString()
    while (i >= 0) {
      const cSlot = this._accounts[i]
      if (cSlot.has(key)) {
        return cSlot.get(key)
      }
      i--
    }
    if (reportUndefined) {
      return undefined
    }
    return new Account()
  }

  isWarmedAddress(address: Address): boolean {
    let i = this._warmAddresses.length - 1
    const key = address.toString()
    while (i >= 0) {
      const cSlot = this._warmAddresses[i]
      if (cSlot.has(key)) {
        return true
      }
      i--
    }
    return false
  }

  isWarmedStorage(address: Address, slot: Buffer): boolean {
    let i = this._warmSlots.length - 1
    const key = address.toString()
    const slotKey = slot.toString('hex')
    while (i >= 0) {
      const storageMap = this._warmSlots[i].get(key)
      if (storageMap) {
        if (storageMap.has(slotKey)) {
          return true
        }
      }
      i--
    }
    return false
  }

  addWarmedStorage(address: Address, slot: Buffer) {
    const map = this.warmSlots
    if (!map.has(address.toString())) {
      map.set(address.toString(), new Set<string>())
    }
    map.get(address.toString())!.add(slot.toString('hex'))
  }

  getOriginalContractStorage(address: Address, key: Buffer): Buffer {
    const map = this._storage[0].get(address.toString())
    if (map) {
      return map.get(key.toString('hex')) ?? Buffer.from('')
    }
    return Buffer.from('')
  }

  async putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void> {
    let map = this.storage.get(address.toString())
    if (!map) {
      this.storage.set(address.toString(), new Map<string, Buffer>())
      map = this.storage.get(address.toString())
    }
    map!.set(key.toString('hex'), value)
  }
  async clearContractStorage(address: Address): Promise<void> {
    if (this.storage.has(address.toString())) {
      this.storage.set(address.toString(), new Map<string, Buffer>())
    }
  }

  commit() {
    if (this._storage.length === 1) {
      throw new Error('Cannot commit upper level')
    }
    const lastStorageMap = this.storage
    const mergeStorageMap = this._storage[this._storage.length - 2]
    for (const [key, storageMap] of lastStorageMap.entries()) {
      let account = mergeStorageMap.get(key)
      if (!account) {
        mergeStorageMap.set(key, new Map<string, Buffer>())
      }
      account = mergeStorageMap.get(key)
      for (const value of storageMap.values()) {
        account!.set(key, value)
      }
    }

    const lastAccountMap = this.accounts
    const mergeAccountMap = this._accounts[this._accounts.length - 2]

    for (const [key, value] of lastAccountMap.entries()) {
      mergeAccountMap.set(key, value)
    }

    const lastWarmAddresses = this.warmAddresses
    const mergeWarmAddresses = this._warmAddresses[this._warmAddresses.length - 2]

    for (const value of lastWarmAddresses) {
      mergeWarmAddresses.add(value)
    }

    const lastWarmSlots = this.warmSlots
    const mergeWarmSlots = this._warmSlots[this._warmSlots.length - 2]

    for (const [key, warmSlots] of lastWarmSlots.entries()) {
      let account = mergeWarmSlots.get(key)
      if (!account) {
        mergeWarmSlots.set(key, new Set<string>())
      }
      account = mergeWarmSlots.get(key)
      for (const value of warmSlots.values()) {
        account!.add(value)
      }
    }

    this._storage.pop()
    this._accounts.pop()
    this._warmAddresses.pop()
    this._warmSlots.pop()
  }

  checkpoint() {
    this._storage.push(new Map<string, Map<string, Buffer>>())
    this._accounts.push(new Map<string, Account>())
    this._warmAddresses.push(new Set<string>())
    this._warmSlots.push(new Map<string, Set<string>>())
  }

  revert() {
    if (this._storage.length === 1) {
      throw new Error('Cannot revert upper level')
    }
    this._storage.pop()
    this._accounts.pop()
    this._warmAddresses.pop()
    this._warmSlots.pop()
  }
}
