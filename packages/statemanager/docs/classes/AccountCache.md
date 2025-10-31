[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / AccountCache

# Class: AccountCache

Defined in: [cache/account.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L21)

## Extends

- `Cache`

## Constructors

### Constructor

> **new AccountCache**(`opts`): `AccountCache`

Defined in: [cache/account.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L35)

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

Defined in: [cache/cache.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L8)

#### Inherited from

`Cache._checkpoints`

***

### \_debug

> **\_debug**: `Debugger`

Defined in: [cache/cache.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L6)

#### Inherited from

`Cache._debug`

***

### \_diffCache

> **\_diffCache**: `Map`\<`string`, `AccountCacheElement` \| `undefined`\>[] = `[]`

Defined in: [cache/account.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L34)

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `LRUCache`\<`string`, `AccountCacheElement`, `unknown`\> \| `undefined`

Defined in: [cache/account.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L22)

***

### \_orderedMapCache

> **\_orderedMapCache**: `OrderedMap`\<`string`, `AccountCacheElement`\> \| `undefined`

Defined in: [cache/account.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L23)

***

### \_stats

> **\_stats**: `object`

Defined in: [cache/cache.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L10)

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

Defined in: [cache/account.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L50)

#### Parameters

##### cacheKeyHex

`string`

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: [cache/account.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L222)

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/account.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L264)

Clears cache.

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/account.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L202)

Commits to current state of cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: [cache/account.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L122)

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

Defined in: [cache/account.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L145)

Flushes cache by returning accounts that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `AccountCacheElement`\][]

***

### get()

> **get**(`address`): `AccountCacheElement` \| `undefined`

Defined in: [cache/account.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L99)

Returns the queried account or undefined if account doesn't exist

#### Parameters

##### address

`Address`

Address of account

#### Returns

`AccountCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `account`, `couldBePartialAccount`): `void`

Defined in: [cache/account.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L68)

Puts account to cache under its address.

#### Parameters

##### address

`Address`

Address of account

##### account

Account or undefined if account doesn't exist in the trie

`Account` | `undefined`

##### couldBePartialAccount

`boolean` = `false`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/account.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L174)

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [cache/account.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L234)

Returns the size of the cache

#### Returns

`number`

***

### stats()

> **stats**(`reset`): `object`

Defined in: [cache/account.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L246)

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
