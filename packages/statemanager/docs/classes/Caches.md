[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / Caches

# Class: Caches

Defined in: [cache/caches.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L9)

Bundled account, code, and storage caches with shared checkpointing.

## Constructors

### Constructor

> **new Caches**(`opts?`): `Caches`

Defined in: [cache/caches.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L16)

#### Parameters

##### opts?

[`CachesStateManagerOpts`](../interfaces/CachesStateManagerOpts.md) = `{}`

#### Returns

`Caches`

## Properties

### account?

> `optional` **account?**: [`AccountCache`](AccountCache.md)

Defined in: [cache/caches.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L10)

***

### code?

> `optional` **code?**: [`CodeCache`](CodeCache.md)

Defined in: [cache/caches.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L11)

***

### settings

> **settings**: `Record`\<`"account"` \| `"code"` \| `"storage"`, [`CacheOpts`](../interfaces/CacheOpts.md)\>

Defined in: [cache/caches.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L14)

***

### storage?

> `optional` **storage?**: [`StorageCache`](StorageCache.md)

Defined in: [cache/caches.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L12)

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [cache/caches.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L60)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/caches.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L66)

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/caches.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L72)

#### Returns

`void`

***

### deleteAccount()

> **deleteAccount**(`address`): `void`

Defined in: [cache/caches.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L78)

#### Parameters

##### address

`Address`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/caches.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L121)

#### Returns

`void`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): `Caches` \| `undefined`

Defined in: [cache/caches.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L84)

#### Parameters

##### downlevelCaches

`boolean`

#### Returns

`Caches` \| `undefined`
