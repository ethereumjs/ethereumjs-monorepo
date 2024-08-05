import { type AccountFields, CacheType, type StateManagerInterface } from '@ethereumjs/common'
import { Account } from '@ethereumjs/util'

import { AccountCache, CodeCache, OriginalStorageCache, StorageCache } from './cache/index.js'

import type { CacheStateManagerOpts } from './types.js'
import type { Address } from '@ethereumjs/util'

export function checkpointCaches(stateManager: StateManagerInterface): void {
  stateManager._accountCache?.checkpoint()
  stateManager._storageCache?.checkpoint()
  stateManager._codeCache?.checkpoint()
}

export function commitCaches(stateManager: StateManagerInterface): void {
  stateManager._accountCache?.commit()
  stateManager._storageCache?.commit()
  stateManager._codeCache?.commit()
}

export function initializeCaches(
  stateManager: StateManagerInterface,
  options: CacheStateManagerOpts,
): void {
  stateManager.originalStorageCache = new OriginalStorageCache(
    stateManager.getStorage.bind(stateManager),
  )

  stateManager._accountCacheSettings = {
    deactivate: options.accountCacheOpts?.deactivate ?? false,
    type: options.accountCacheOpts?.type ?? CacheType.ORDERED_MAP,
    size: options.accountCacheOpts?.size ?? 100000,
  }

  if (stateManager._accountCacheSettings.deactivate === false) {
    stateManager._accountCache = new AccountCache({
      size: stateManager._accountCacheSettings.size,
      type: stateManager._accountCacheSettings.type,
    })
  }

  stateManager._storageCacheSettings = {
    deactivate: options.storageCacheOpts?.deactivate ?? false,
    type: options.storageCacheOpts?.type ?? CacheType.ORDERED_MAP,
    size: options.storageCacheOpts?.size ?? 20000,
  }

  if (stateManager._storageCacheSettings.deactivate === false) {
    stateManager._storageCache = new StorageCache({
      size: stateManager._storageCacheSettings.size,
      type: stateManager._storageCacheSettings.type,
    })
  }

  stateManager._codeCacheSettings = {
    deactivate:
      (options.codeCacheOpts?.deactivate === true || options.codeCacheOpts?.size === 0) ?? false,
    type: options.codeCacheOpts?.type ?? CacheType.ORDERED_MAP,
    size: options.codeCacheOpts?.size ?? 20000,
  }

  if (stateManager._codeCacheSettings.deactivate === false) {
    stateManager._codeCache = new CodeCache({
      size: stateManager._codeCacheSettings.size,
      type: stateManager._codeCacheSettings.type,
    })
  }
}

export async function modifyAccountFields(
  stateManager: StateManagerInterface,
  address: Address,
  accountFields: AccountFields,
): Promise<void> {
  const account = (await stateManager.getAccount(address)) ?? new Account()

  account.nonce = accountFields.nonce ?? account.nonce
  account.balance = accountFields.balance ?? account.balance
  account.storageRoot = accountFields.storageRoot ?? account.storageRoot
  account.codeHash = accountFields.codeHash ?? account.codeHash
  await stateManager.putAccount(address, account)
}

export function revertCaches(stateManager: StateManagerInterface): void {
  stateManager._accountCache?.revert()
  stateManager._storageCache?.revert()
  stateManager._codeCache?.revert()
}
