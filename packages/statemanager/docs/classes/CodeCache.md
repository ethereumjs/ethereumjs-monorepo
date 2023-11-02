[@ethereumjs/statemanager](../README.md) / CodeCache

# Class: CodeCache

## Hierarchy

- `Cache`

  ↳ **`CodeCache`**

## Table of contents

### Constructors

- [constructor](CodeCache.md#constructor)

### Properties

- [\_checkpoints](CodeCache.md#_checkpoints)
- [\_debug](CodeCache.md#_debug)
- [\_diffCache](CodeCache.md#_diffcache)
- [\_lruCache](CodeCache.md#_lrucache)
- [\_orderedMapCache](CodeCache.md#_orderedmapcache)
- [\_stats](CodeCache.md#_stats)

### Methods

- [\_saveCachePreState](CodeCache.md#_savecacheprestate)
- [checkpoint](CodeCache.md#checkpoint)
- [clear](CodeCache.md#clear)
- [commit](CodeCache.md#commit)
- [del](CodeCache.md#del)
- [flush](CodeCache.md#flush)
- [get](CodeCache.md#get)
- [put](CodeCache.md#put)
- [revert](CodeCache.md#revert)
- [size](CodeCache.md#size)
- [stats](CodeCache.md#stats)

## Constructors

### constructor

• **new CodeCache**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CacheOpts`](../interfaces/CacheOpts.md) |

#### Overrides

Cache.constructor

#### Defined in

[cache/code.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L36)

## Properties

### \_checkpoints

• **\_checkpoints**: `number` = `0`

#### Inherited from

Cache.\_checkpoints

#### Defined in

[cache/cache.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L9)

___

### \_debug

• **\_debug**: `Debugger`

#### Inherited from

Cache.\_debug

#### Defined in

[cache/cache.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L7)

___

### \_diffCache

• **\_diffCache**: `Map`<`string`, `undefined` \| `CodeCacheElement`\>[] = `[]`

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the code), the element didn't exist in the cache
before.

#### Defined in

[cache/code.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L34)

___

### \_lruCache

• **\_lruCache**: `undefined` \| `LRUCache`<`string`, `CodeCacheElement`, `unknown`\>

#### Defined in

[cache/code.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L22)

___

### \_orderedMapCache

• **\_orderedMapCache**: `undefined` \| `OrderedMap`<`string`, `CodeCacheElement`\>

#### Defined in

[cache/code.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L23)

___

### \_stats

• **\_stats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dels` | `number` |
| `hits` | `number` |
| `reads` | `number` |
| `size` | `number` |
| `writes` | `number` |

#### Inherited from

Cache.\_stats

#### Defined in

[cache/cache.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/cache.ts#L11)

## Methods

### \_saveCachePreState

▸ **_saveCachePreState**(`cacheKeyHex`): `void`

Saves the state of the code cache before making changes to it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheKeyHex` | `string` | Account key for which code is being modified. |

#### Returns

`void`

#### Defined in

[cache/code.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L56)

___

### checkpoint

▸ **checkpoint**(): `void`

Marks the current state of the cache as a checkpoint, which can
later be reverted or committed.

#### Returns

`void`

#### Defined in

[cache/code.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L222)

___

### clear

▸ **clear**(): `void`

Clears the cache.

#### Returns

`void`

#### Defined in

[cache/code.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L266)

___

### commit

▸ **commit**(): `void`

Commits the current state of the cache (no effect on trie).

#### Returns

`void`

#### Defined in

[cache/code.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L202)

___

### del

▸ **del**(`address`): `void`

Marks code as deleted in the cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Account address for which code is being fetched. |

#### Returns

`void`

#### Defined in

[cache/code.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L122)

___

### flush

▸ **flush**(): [`string`, `CodeCacheElement`][]

Flushes the cache by returning codes that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

[`string`, `CodeCacheElement`][]

#### Defined in

[cache/code.ts:145](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L145)

___

### get

▸ **get**(`address`): `undefined` \| `CodeCacheElement`

Returns the queried code or undefined if it doesn't exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Account address for which code is being fetched. |

#### Returns

`undefined` \| `CodeCacheElement`

#### Defined in

[cache/code.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L98)

___

### put

▸ **put**(`address`, `code`): `void`

Puts code into the cache under its hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account code is being modified for. |
| `code` | `undefined` \| `Uint8Array` | Bytecode or undefined if code doesn't exist. |

#### Returns

`void`

#### Defined in

[cache/code.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L75)

___

### revert

▸ **revert**(): `void`

Revert changes to the cache to the last checkpoint (no effect on trie).

#### Returns

`void`

#### Defined in

[cache/code.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L174)

___

### size

▸ **size**(): `number`

Returns the size of the cache

#### Returns

`number`

#### Defined in

[cache/code.ts:234](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L234)

___

### stats

▸ **stats**(`reset?`): `any`

Returns a dictionary with cache statistics.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `reset` | `boolean` | `true` | Whether to reset statistics after retrieval. |

#### Returns

`any`

A dictionary with cache statistics.

#### Defined in

[cache/code.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/code.ts#L248)
