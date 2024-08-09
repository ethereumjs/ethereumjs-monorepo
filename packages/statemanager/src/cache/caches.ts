import { AccountCache } from './account.js'
import { CodeCache } from './code.js'
import { StorageCache } from './storage.js'
import { type CacheSettings, CacheType, type CachesStateManagerOpts } from './types.js'

import type { Address } from '@ethereumjs/util'

export class Caches {
  account?: AccountCache
  code?: CodeCache
  storage?: StorageCache

  settings: Record<'account' | 'code' | 'storage', CacheSettings>

  constructor(opts: CachesStateManagerOpts = {}) {
    const accountSettings = {
      deactivate:
        (opts.accountCacheOpts?.deactivate === true || opts.accountCacheOpts?.size === 0) ?? false,
      type: opts.accountCacheOpts?.type ?? CacheType.ORDERED_MAP,
      size: opts.accountCacheOpts?.size ?? 100000,
    }
    const storageSettings = {
      deactivate:
        (opts.storageCacheOpts?.deactivate === true || opts.storageCacheOpts?.size === 0) ?? false,
      type: opts.storageCacheOpts?.type ?? CacheType.ORDERED_MAP,
      size: opts.storageCacheOpts?.size ?? 20000,
    }

    const codeSettings = {
      deactivate:
        (opts.codeCacheOpts?.deactivate === true || opts.codeCacheOpts?.size === 0) ?? false,
      type: opts.codeCacheOpts?.type ?? CacheType.ORDERED_MAP,
      size: opts.codeCacheOpts?.size ?? 20000,
    }

    this.settings = {
      account: accountSettings,
      code: codeSettings,
      storage: storageSettings,
    }

    if (this.settings.account.deactivate === false) {
      this.account = new AccountCache({
        size: this.settings.account.size,
        type: this.settings.account.type,
      })
    }

    if (this.settings.storage.deactivate === false) {
      this.storage = new StorageCache({
        size: this.settings.storage.size,
        type: this.settings.storage.type,
      })
    }

    if (this.settings.code.deactivate === false) {
      this.code = new CodeCache({
        size: this.settings.code.size,
        type: this.settings.code.type,
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
