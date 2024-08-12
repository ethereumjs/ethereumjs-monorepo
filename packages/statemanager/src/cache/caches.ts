import { AccountCache } from './account.js'
import { CodeCache } from './code.js'
import { StorageCache } from './storage.js'
import { CacheType, type CachesStateManagerOpts } from './types.js'

import type { CacheOpts } from './types.js'
import type { Address } from '@ethereumjs/util'

export class Caches {
  account?: AccountCache
  code?: CodeCache
  storage?: StorageCache

  settings: Record<'account' | 'code' | 'storage', CacheOpts>

  constructor(opts: CachesStateManagerOpts = {}) {
    const accountSettings = {
      type: opts.account?.type ?? CacheType.ORDERED_MAP,
      size: opts.account?.size ?? 100000,
    }

    const codeSettings = {
      type: opts.code?.type ?? CacheType.ORDERED_MAP,
      size: opts.code?.size ?? 20000,
    }

    const storageSettings = {
      type: opts.storage?.type ?? CacheType.ORDERED_MAP,
      size: opts.storage?.size ?? 20000,
    }

    this.settings = {
      account: accountSettings,
      code: codeSettings,
      storage: storageSettings,
    }

    if (this.settings.account.size !== 0) {
      this.account = new AccountCache({
        size: this.settings.account.size,
        type: this.settings.account.type,
      })
    }

    if (this.settings.code.size !== 0) {
      this.code = new CodeCache({
        size: this.settings.code.size,
        type: this.settings.code.type,
      })
    }

    if (this.settings.storage.size !== 0) {
      this.storage = new StorageCache({
        size: this.settings.storage.size,
        type: this.settings.storage.type,
      })
    }
  }

  checkpoint() {
    this.account?.checkpoint()
    this.storage?.checkpoint()
    this.code?.checkpoint()
  }

  clear() {
    this.account?.clear()
    this.storage?.clear()
    this.code?.clear()
  }

  commit() {
    this.account?.commit()
    this.storage?.commit()
    this.code?.commit()
  }

  deleteAccount(address: Address) {
    this.code?.del(address)
    this.account?.del(address)
    this.storage?.clearStorage(address)
  }

  revert() {
    this.account?.revert()
    this.storage?.revert()
    this.code?.revert()
  }
}
