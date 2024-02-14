[@ethereumjs/statemanager](../README.md) / StorageCache

# Class: StorageCache

## Hierarchy

- `Cache`

  ↳ **`StorageCache`**

## Table of contents

### Constructors

- [constructor](StorageCache.md#constructor)

### Properties

- [\_checkpoints](StorageCache.md#_checkpoints)
- [\_debug](StorageCache.md#_debug)
- [\_diffCache](StorageCache.md#_diffcache)
- [\_lruCache](StorageCache.md#_lrucache)
- [\_orderedMapCache](StorageCache.md#_orderedmapcache)
- [\_stats](StorageCache.md#_stats)

### Methods

- [\_saveCachePreState](StorageCache.md#_savecacheprestate)
- [checkpoint](StorageCache.md#checkpoint)
- [clear](StorageCache.md#clear)
- [clearContractStorage](StorageCache.md#clearcontractstorage)
- [commit](StorageCache.md#commit)
- [del](StorageCache.md#del)
- [dump](StorageCache.md#dump)
- [flush](StorageCache.md#flush)
- [get](StorageCache.md#get)
- [put](StorageCache.md#put)
- [revert](StorageCache.md#revert)
- [size](StorageCache.md#size)
- [stats](StorageCache.md#stats)

## Constructors

### constructor

• **new StorageCache**(`opts`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`CacheOpts`](../interfaces/CacheOpts.md) |

#### Overrides

Cache.constructor

#### Defined in

[cache/storage.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L36)

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

• **\_diffCache**: `Map`<`string`, `DiffStorageCacheMap`\>[] = `[]`

Diff cache collecting the state of the cache
at the beginning of checkpoint height
(respectively: before a first modification)

If the whole cache element is undefined (in contrast
to the account), the element didn't exist in the cache
before.

#### Defined in

[cache/storage.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L34)

___

### \_lruCache

• **\_lruCache**: `undefined` \| `LRUCache`<`string`, `StorageCacheMap`, `unknown`\>

#### Defined in

[cache/storage.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L22)

___

### \_orderedMapCache

• **\_orderedMapCache**: `undefined` \| `OrderedMap`<`string`, `StorageCacheMap`\>

#### Defined in

[cache/storage.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L23)

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

▸ **_saveCachePreState**(`addressHex`, `keyHex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressHex` | `string` |
| `keyHex` | `string` |

#### Returns

`void`

#### Defined in

[cache/storage.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L54)

___

### checkpoint

▸ **checkpoint**(): `void`

Marks current state of cache as checkpoint, which can
later on be reverted or committed.

#### Returns

`void`

#### Defined in

[cache/storage.ts:300](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L300)

___

### clear

▸ **clear**(): `void`

Clears cache.

#### Returns

`void`

#### Defined in

[cache/storage.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L342)

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `void`

Deletes all storage slots for address from the cache

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Returns

`void`

#### Defined in

[cache/storage.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L176)

___

### commit

▸ **commit**(): `void`

Commits to current state of cache (no effect on trie).

#### Returns

`void`

#### Defined in

[cache/storage.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L267)

___

### del

▸ **del**(`address`, `key`): `void`

Marks storage key for address as deleted in cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address |
| `key` | `Uint8Array` | Storage key |

#### Returns

`void`

#### Defined in

[cache/storage.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L146)

___

### dump

▸ **dump**(`address`): `undefined` \| `StorageCacheMap`

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | The address of the `account` to return storage for |

#### Returns

`undefined` \| `StorageCacheMap`

- The storage values for the `account` or undefined if the `account` is not in the cache

#### Defined in

[cache/storage.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L358)

___

### flush

▸ **flush**(): [`string`, `string`, `undefined` \| `Uint8Array`][]

Flushes cache by returning storage slots that have been modified
or deleted and resetting the diff cache (at checkpoint height).

#### Returns

[`string`, `string`, `undefined` \| `Uint8Array`][]

#### Defined in

[cache/storage.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L189)

___

### get

▸ **get**(`address`, `key`): `undefined` \| `Uint8Array`

Returns the queried slot as the RLP encoded storage value
hexToBytes('0x80'): slot is known to be empty
undefined: slot is not in cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Address of account |
| `key` | `Uint8Array` | Storage key |

#### Returns

`undefined` \| `Uint8Array`

Storage value or undefined

#### Defined in

[cache/storage.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L121)

___

### put

▸ **put**(`address`, `key`, `value`): `void`

Puts storage value to cache under address_key cache key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `Address` | Account address |
| `key` | `Uint8Array` | Storage key |
| `value` | `Uint8Array` | - |

#### Returns

`void`

#### Defined in

[cache/storage.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L83)

___

### revert

▸ **revert**(): `void`

Revert changes to cache last checkpoint (no effect on trie).

#### Returns

`void`

#### Defined in

[cache/storage.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L225)

___

### size

▸ **size**(): `number`

Returns the size of the cache

#### Returns

`number`

#### Defined in

[cache/storage.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L312)

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

[cache/storage.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/storage.ts#L324)
