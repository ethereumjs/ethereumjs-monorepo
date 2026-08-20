[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / AccountCache

# Class: AccountCache

Defined in: [cache/account.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L22)

In-memory account cache with checkpoint/revert support.

## Extends

- `Cache`

## Constructors

### Constructor

> **new AccountCache**(`opts`): `AccountCache`

Defined in: [cache/account.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L36)

#### Parameters

##### opts

[`CacheOpts`](../interfaces/CacheOpts.md)

#### Returns

`AccountCache`

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

> **\_diffCache**: `Map`\<`string`, `AccountCacheElement` \| `undefined`\>[] = `[]`

Defined in: [cache/account.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L35)

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `LRUCache`\<`string`, `AccountCacheElement`, `unknown`\> \| `undefined`

Defined in: [cache/account.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L23)

***

### \_orderedMapCache

> **\_orderedMapCache**: `OrderedMap`\<`string`, `AccountCacheElement`\> \| `undefined`

Defined in: [cache/account.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L24)

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

> **\_saveCachePreState**(`cacheKeyHex`): `void`

Defined in: [cache/account.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L51)

#### Parameters

##### cacheKeyHex

`string`

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: [cache/account.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L226)

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/account.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L268)

Clears cache.

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/account.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L206)

Commits to current state of cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: [cache/account.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L125)

Marks address as deleted in cache.

#### Parameters

##### address

`Address`

Address

#### Returns

`void`

***

### flush()

> **flush**(): \[`string`, `AccountCacheElement`\][]

Defined in: [cache/account.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L149)

Flushes cache by returning accounts that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `AccountCacheElement`\][]

***

### get()

> **get**(`address`): `AccountCacheElement` \| `undefined`

Defined in: [cache/account.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L101)

Returns the queried account or undefined if account doesn't exist

#### Parameters

##### address

`Address`

Address of account

#### Returns

`AccountCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `account`, `couldBePartialAccount?`): `void`

Defined in: [cache/account.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L69)

Puts account to cache under its address.

#### Parameters

##### address

`Address`

Address of account

##### account

`Account` \| `undefined`

Account or undefined if account doesn't exist in the trie

##### couldBePartialAccount?

`boolean` = `false`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/account.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L178)

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [cache/account.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L237)

Current number of cached accounts.

#### Returns

`number`

***

### stats()

> **stats**(`reset?`): `object`

Defined in: [cache/account.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L250)

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
