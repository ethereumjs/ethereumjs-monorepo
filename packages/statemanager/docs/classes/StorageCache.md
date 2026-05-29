[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StorageCache

# Class: StorageCache

Defined in: [cache/storage.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L20)

## Extends

- `Cache`

## Constructors

### Constructor

> **new StorageCache**(`opts`): `StorageCache`

Defined in: [cache/storage.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L35)

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

Defined in: [cache/cache.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L9)

#### Inherited from

`Cache._checkpoints`

***

### \_debug

> **\_debug**: `Debugger`

Defined in: [cache/cache.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L7)

#### Inherited from

`Cache._debug`

***

### \_diffCache

> **\_diffCache**: `Map`\<`string`, `DiffStorageCacheMap`\>[] = `[]`

Defined in: [cache/storage.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L33)

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `LRUCache`\<`string`, `StorageCacheMap`, `unknown`\> \| `undefined`

Defined in: [cache/storage.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L21)

***

### \_orderedMapCache

> **\_orderedMapCache**: `OrderedMap`\<`string`, `StorageCacheMap`\> \| `undefined`

Defined in: [cache/storage.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L22)

***

### \_stats

> **\_stats**: `object`

Defined in: [cache/cache.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L11)

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

Defined in: [cache/storage.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L53)

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

Defined in: [cache/storage.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L302)

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

Defined in: [cache/storage.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L176)

Deletes all storage slots for address from the cache

#### Parameters

##### address

`Address`

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/storage.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L269)

Commits to current state of cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`, `key`): `void`

Defined in: [cache/storage.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L146)

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

The address of the `account` to return storage for

#### Returns

`StorageCacheMap` \| `undefined`

- The storage values for the `account` or undefined if the `account` is not in the cache

***

### flush()

> **flush**(): \[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

Defined in: [cache/storage.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L189)

Flushes cache by returning storage slots that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `string`, `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\][]

***

### get()

> **get**(`address`, `key`): `Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Defined in: [cache/storage.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L121)

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

Defined in: [cache/storage.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L82)

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

Defined in: [cache/storage.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L227)

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [cache/storage.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L314)

Returns the size of the cache

#### Returns

`number`

***

### stats()

> **stats**(`reset`): `object`

Defined in: [cache/storage.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L326)

Returns a dict with cache stats

#### Parameters

##### reset

`boolean` = `true`

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
