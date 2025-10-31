[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / CodeCache

# Class: CodeCache

Defined in: [cache/code.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L19)

## Extends

- `Cache`

## Constructors

### Constructor

> **new CodeCache**(`opts`): `CodeCache`

Defined in: [cache/code.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L34)

#### Parameters

##### opts

[`CacheOpts`](../interfaces/CacheOpts.md)

#### Returns

`CodeCache`

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

> **\_diffCache**: `Map`\<`string`, `CodeCacheElement` \| `undefined`\>[] = `[]`

Defined in: [cache/code.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L32)

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the code), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `LRUCache`\<`string`, `CodeCacheElement`, `unknown`\> \| `undefined`

Defined in: [cache/code.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L20)

***

### \_orderedMapCache

> **\_orderedMapCache**: `OrderedMap`\<`string`, `CodeCacheElement`\> \| `undefined`

Defined in: [cache/code.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L21)

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

Defined in: [cache/code.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L54)

Saves the state of the code cache before making changes to it.

#### Parameters

##### cacheKeyHex

`string`

Account key for which code is being modified.

#### Returns

`void`

***

### checkpoint()

> **checkpoint**(): `void`

Defined in: [cache/code.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L220)

Marks the current state of the cache as a checkpoint, which can
later be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/code.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L264)

Clears the cache.

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/code.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L200)

Commits the current state of the cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: [cache/code.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L120)

Marks code as deleted in the cache.

#### Parameters

##### address

`Address`

Account address for which code is being fetched.

#### Returns

`void`

***

### flush()

> **flush**(): \[`string`, `CodeCacheElement`\][]

Defined in: [cache/code.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L143)

Flushes the cache by returning codes that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `CodeCacheElement`\][]

***

### get()

> **get**(`address`): `CodeCacheElement` \| `undefined`

Defined in: [cache/code.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L96)

Returns the queried code or undefined if it doesn't exist.

#### Parameters

##### address

`Address`

Account address for which code is being fetched.

#### Returns

`CodeCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `code`): `void`

Defined in: [cache/code.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L73)

Puts code into the cache under its hash.

#### Parameters

##### address

`Address`

Address of account code is being modified for.

##### code

Bytecode or undefined if code doesn't exist.

`Uint8Array`\<`ArrayBufferLike`\> | `undefined`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/code.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L172)

Revert changes to the cache to the last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [cache/code.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L232)

Returns the size of the cache

#### Returns

`number`

***

### stats()

> **stats**(`reset`): `any`

Defined in: [cache/code.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L246)

Returns a dictionary with cache statistics.

#### Parameters

##### reset

`boolean` = `true`

Whether to reset statistics after retrieval.

#### Returns

`any`

A dictionary with cache statistics.
