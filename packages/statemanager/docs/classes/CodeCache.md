[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / CodeCache

# Class: CodeCache

Defined in: [cache/code.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L20)

In-memory contract code cache with checkpoint/revert support.

## Extends

- `Cache`

## Constructors

### Constructor

> **new CodeCache**(`opts`): `CodeCache`

Defined in: [cache/code.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L35)

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

> **\_diffCache**: `Map`\<`string`, `CodeCacheElement` \| `undefined`\>[] = `[]`

Defined in: [cache/code.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L33)

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the code), the element didn't exist in the cache
before.

***

### \_lruCache

> **\_lruCache**: `LRUCache`\<`string`, `CodeCacheElement`, `unknown`\> \| `undefined`

Defined in: [cache/code.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L21)

***

### \_orderedMapCache

> **\_orderedMapCache**: `OrderedMap`\<`string`, `CodeCacheElement`\> \| `undefined`

Defined in: [cache/code.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L22)

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

Defined in: [cache/code.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L55)

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

Defined in: [cache/code.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L224)

Marks the current state of the cache as a checkpoint, which can
later be reverted or committed.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/code.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L265)

Clears the cache.

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/code.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L204)

Commits the current state of the cache (no effect on trie).

#### Returns

`void`

***

### del()

> **del**(`address`): `void`

Defined in: [cache/code.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L123)

Marks code as deleted in the cache.

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Account address for which code is being fetched.

#### Returns

`void`

***

### flush()

> **flush**(): \[`string`, `CodeCacheElement`\][]

Defined in: [cache/code.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L147)

Flushes the cache by returning codes that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

\[`string`, `CodeCacheElement`\][]

***

### get()

> **get**(`address`): `CodeCacheElement` \| `undefined`

Defined in: [cache/code.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L98)

Returns the queried code or undefined if it doesn't exist.

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Account address for which code is being fetched.

#### Returns

`CodeCacheElement` \| `undefined`

***

### put()

> **put**(`address`, `code`): `void`

Defined in: [cache/code.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L74)

Puts code into the cache under its hash.

#### Parameters

##### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Address of account code is being modified for.

##### code

`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`

Bytecode or undefined if code doesn't exist.

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/code.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L176)

Revert changes to the cache to the last checkpoint (no effect on trie).

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [cache/code.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L233)

Current number of cached code entries.

#### Returns

`number`

***

### stats()

> **stats**(`reset?`): `any`

Defined in: [cache/code.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L247)

Returns a dictionary with cache statistics.

#### Parameters

##### reset?

`boolean` = `true`

Whether to reset statistics after retrieval.

#### Returns

`any`

A dictionary with cache statistics.
