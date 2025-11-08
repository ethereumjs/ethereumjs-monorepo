[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / Caches

# Class: Caches

Defined in: [cache/caches.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L8)

## Constructors

### Constructor

> **new Caches**(`opts`): `Caches`

Defined in: [cache/caches.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L15)

#### Parameters

##### opts

[`CachesStateManagerOpts`](../interfaces/CachesStateManagerOpts.md) = `{}`

#### Returns

`Caches`

## Properties

### account?

> `optional` **account**: [`AccountCache`](AccountCache.md)

Defined in: [cache/caches.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L9)

***

### code?

> `optional` **code**: [`CodeCache`](CodeCache.md)

Defined in: [cache/caches.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L10)

***

### settings

> **settings**: `Record`\<`"account"` \| `"code"` \| `"storage"`, [`CacheOpts`](../interfaces/CacheOpts.md)\>

Defined in: [cache/caches.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L13)

***

### storage?

> `optional` **storage**: [`StorageCache`](StorageCache.md)

Defined in: [cache/caches.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L11)

## Methods

### checkpoint()

> **checkpoint**(): `void`

Defined in: [cache/caches.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L59)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [cache/caches.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L65)

#### Returns

`void`

***

### commit()

> **commit**(): `void`

Defined in: [cache/caches.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L71)

#### Returns

`void`

***

### deleteAccount()

> **deleteAccount**(`address`): `void`

Defined in: [cache/caches.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L77)

#### Parameters

##### address

`Address`

#### Returns

`void`

***

### revert()

> **revert**(): `void`

Defined in: [cache/caches.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L120)

#### Returns

`void`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): `Caches` \| `undefined`

Defined in: [cache/caches.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/caches.ts#L83)

#### Parameters

##### downlevelCaches

`boolean`

#### Returns

`Caches` \| `undefined`
