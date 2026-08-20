[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StorageCache

# Class: StorageCache

Defined in: [cache/storage.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L21)

In-memory storage slot cache with checkpoint/revert support.

## Extends

- `Cache`

## Constructors

### Constructor

> **new StorageCache**(`opts`): `StorageCache`

Defined in: [cache/storage.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L36)

#### Parameters

##### opts

[`CacheOpts`](../interfaces/CacheOpts.md)

#### Returns

`StorageCache`

#### Overrides

`Cache.constructor`

## Properties

### \_checkpoints

> **\_checkpoints**: `number` = `0`

Defined in: [cache/cache.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L10)

#### Inherited from

`Cache._checkpoints`

***

### \_debug

> **\_debug**: `Debugger`

Defined in: [cache/cache.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L8)

#### Inherited from

`Cache._debug`

***

### \_diffCache

> **\_diffCache**: `Map`\<`string`, `DiffStorageCacheMap`\>[] = `[]`

Defined in: [cache/storage.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L34)

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `LRUCache`\<`string`, `StorageCacheMap`, `unknown`\> \| `undefined`

Defined in: [cache/storage.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L22)

***

### \_orderedMapCache

> **\_orderedMapCache**: `OrderedMap`\<`string`, `StorageCacheMap`\> \| `undefined`

Defined in: [cache/storage.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L23)

***

### \_stats

> **\_stats**: `object`

Defined in: [cache/cache.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L12)

#### deletions

> **deletions**: `number` = `0`

#### hits

> **hits**: `number` = `0`

#### reads

> **reads**: `number` = `0`

#### size

> **size**: `number` = `0`

#### writes

> **writes**: `number` = `0`

#### Inherited from

`Cache._stats`

## Methods

### \_saveCachePreState()

> **\_saveCachePreState**(`addressHex`, `keyHex`): `void`

Defined in: [cache/storage.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L54)

#### Parameters

##### addressHex

`string`

##### keyHex

`string`

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: [cache/storage.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L304)

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/storage.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L344)

Clears cache.

#### Returns

`void`

***

### clearStorage()

> **clearStorage**(`address`): `void`

Defined in: [cache/storage.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L178)

Remove all cached storage slots for an account.

#### Parameters

##### address

`Address`

Account whose storage map should be cleared

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/storage.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L271)

Commits to current state of cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`, `key`): `void`

Defined in: [cache/storage.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L147)

Marks storage key for address as deleted in cache.

#### Parameters

##### address

`Address`

Address

##### key

`Uint8Array`

Storage key

#### Returns

`void`

***

### dump()

> **dump**(`address`): `StorageCacheMap` \| `undefined`

Defined in: [cache/storage.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L360)

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

##### address

`Address`

Account to dump from the cache

#### Returns

`StorageCacheMap` \| `undefined`

Map of slot hex keys to values, or `undefined` when the account is not cached

***

### flush()

> **flush**(): \[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

Defined in: [cache/storage.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L191)

Flushes cache by returning storage slots that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

***

### get()

> **get**(`address`, `key`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [cache/storage.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L122)

Returns the queried slot as the RLP encoded storage value
hexToBytes('0x80'): slot is known to be empty
undefined: slot is not in cache

#### Parameters

##### address

`Address`

Address of account

##### key

`Uint8Array`

Storage key

#### Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Storage value or undefined

***

### put()

> **put**(`address`, `key`, `value`): `void`

Defined in: [cache/storage.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L83)

Puts storage value to cache under address_key cache key.

#### Parameters

##### address

`Address`

Account address

##### key

`Uint8Array`

Storage key

##### value

`Uint8Array`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/storage.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L229)

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [cache/storage.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L313)

Current number of accounts with cached storage maps.

#### Returns

`number`

***

### stats()

> **stats**(`reset?`): `object`

Defined in: [cache/storage.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L326)

Read/write statistics for this cache.

#### Parameters

##### reset?

`boolean` = `true`

When `true` (default), zero counters after reading

#### Returns

`object`

##### deletions

> **deletions**: `number` = `0`

##### hits

> **hits**: `number` = `0`

##### reads

> **reads**: `number` = `0`

##### size

> **size**: `number` = `0`

##### writes

> **writes**: `number` = `0`
