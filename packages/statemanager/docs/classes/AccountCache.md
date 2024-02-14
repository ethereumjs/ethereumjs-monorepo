[@ethereumjs/statemanager](../README.md) / AccountCache

# Class: AccountCache

## Hierarchy

- `Cache`

  ↳ **`AccountCache`**

## Table of contents

### Constructors

- [constructor](AccountCache.md#constructor)

### Properties

- [\_checkpoints](AccountCache.md#_checkpoints)
- [\_debug](AccountCache.md#_debug)
- [\_diffCache](AccountCache.md#_diffcache)
- [\_lruCache](AccountCache.md#_lrucache)
- [\_orderedMapCache](AccountCache.md#_orderedmapcache)
- [\_stats](AccountCache.md#_stats)

### Methods

- [\_saveCachePreState](AccountCache.md#_savecacheprestate)
- [checkpoint](AccountCache.md#checkpoint)
- [clear](AccountCache.md#clear)
- [commit](AccountCache.md#commit)
- [del](AccountCache.md#del)
- [flush](AccountCache.md#flush)
- [get](AccountCache.md#get)
- [put](AccountCache.md#put)
- [revert](AccountCache.md#revert)
- [size](AccountCache.md#size)
- [stats](AccountCache.md#stats)

## Constructors

### constructor

• **new AccountCache**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CacheOpts`](../interfaces/CacheOpts.md) |

#### Overrides

Cache.constructor

#### Defined in

[cache/account.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L36)

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

• **\_diffCache**: `Map`<`string`, `undefined` \| `AccountCacheElement`\>[] = `[]`

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

#### Defined in

[cache/account.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L35)

___

### \_lruCache

• **\_lruCache**: `undefined` \| `LRUCache`<`string`, `AccountCacheElement`, `unknown`\>

#### Defined in

[cache/account.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L23)

___

### \_orderedMapCache

• **\_orderedMapCache**: `undefined` \| `OrderedMap`<`string`, `AccountCacheElement`\>

#### Defined in

[cache/account.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L24)

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheKeyHex` | `string` |

#### Returns

`void`

#### Defined in

[cache/account.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L51)

___

### checkpoint

▸ **checkpoint**(): `void`

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

#### Defined in

[cache/account.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L214)

___

### clear

▸ **clear**(): `void`

Clears cache.

#### Returns

`void`

#### Defined in

[cache/account.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L256)

___

### commit

▸ **commit**(): `void`

Commits to current state of cache (no effect on trie).

#### Returns

`void`

#### Defined in

[cache/account.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L194)

___

### del

▸ **del**(`address`): `void`

Marks address as deleted in cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address |

#### Returns

`void`

#### Defined in

[cache/account.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L114)

___

### flush

▸ **flush**(): [`string`, `AccountCacheElement`][]

Flushes cache by returning accounts that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

[`string`, `AccountCacheElement`][]

#### Defined in

[cache/account.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L137)

___

### get

▸ **get**(`address`): `undefined` \| `AccountCacheElement`

Returns the queried account or undefined if account doesn't exist

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |

#### Returns

`undefined` \| `AccountCacheElement`

#### Defined in

[cache/account.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L91)

___

### put

▸ **put**(`address`, `account`): `void`

Puts account to cache under its address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |
| `account` | `undefined` \| `Account` | Account or undefined if account doesn't exist in the trie |

#### Returns

`void`

#### Defined in

[cache/account.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L69)

___

### revert

▸ **revert**(): `void`

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

#### Defined in

[cache/account.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L166)

___

### size

▸ **size**(): `number`

Returns the size of the cache

#### Returns

`number`

#### Defined in

[cache/account.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L226)

___

### stats

▸ **stats**(`reset?`): `Object`

Returns a dict with cache stats

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `reset` | `boolean` | `true` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `dels` | `number` |
| `hits` | `number` |
| `reads` | `number` |
| `size` | `number` |
| `writes` | `number` |

#### Defined in

[cache/account.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/account.ts#L238)
