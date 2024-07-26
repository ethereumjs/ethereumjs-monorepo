import { bytesToUnprefixedHex } from '@ethereumjs/util'

import type { Address } from '@ethereumjs/util'

type getStorage = (address: Address, key: Uint8Array) => Promise<Uint8Array>

/**
 * Helper class to cache original storage values (so values already being present in
 * the pre-state of a call), mainly for correct gas cost calculation in EVM/VM.
 *
 * TODO: Usage of this class is very implicit through the injected `getStorage()`
 * method bound to the calling state manager. It should be examined if there are alternative
 * designs being more transparent and direct along the next breaking release round.
 *
 */
export class OriginalStorageCache {
  private map: Map<string, Map<string, Uint8Array>>
  private getStorage: getStorage
  constructor(getStorage: getStorage) {
    this.map = new Map()
    this.getStorage = getStorage
  }

  async get(address: Address, key: Uint8Array): Promise<Uint8Array> {
    const addressHex = bytesToUnprefixedHex(address.bytes)
    const map = this.map.get(addressHex)
    if (map !== undefined) {
      const keyHex = bytesToUnprefixedHex(key)
      const value = map.get(keyHex)
      if (value !== undefined) {
        return value
      }
    }
    const value = await this.getStorage(address, key)
    this.put(address, key, value)
    return value
  }

  put(address: Address, key: Uint8Array, value: Uint8Array) {
    const addressHex = bytesToUnprefixedHex(address.bytes)
    let map = this.map.get(addressHex)
    if (map === undefined) {
      map = new Map()
      this.map.set(addressHex, map)
    }
    const keyHex = bytesToUnprefixedHex(key)
    if (map!.has(keyHex) === false) {
      map!.set(keyHex, value)
    }
  }

  clear(): void {
    this.map = new Map()
  }
}
