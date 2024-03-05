[@ethereumjs/statemanager](../README.md) / OriginalStorageCache

# Class: OriginalStorageCache

## Table of contents

### Constructors

- [constructor](OriginalStorageCache.md#constructor)

### Methods

- [clear](OriginalStorageCache.md#clear)
- [get](OriginalStorageCache.md#get)
- [put](OriginalStorageCache.md#put)

## Constructors

### constructor

• **new OriginalStorageCache**(`getContractStorage`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getContractStorage` | `getContractStorage` |

#### Defined in

[cache/originalStorageCache.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/originalStorageCache.ts#L10)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[cache/originalStorageCache.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/originalStorageCache.ts#L43)

___

### get

▸ **get**(`address`, `key`): `Promise`<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Promise`<`Uint8Array`\>

#### Defined in

[cache/originalStorageCache.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/originalStorageCache.ts#L15)

___

### put

▸ **put**(`address`, `key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[cache/originalStorageCache.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/cache/originalStorageCache.ts#L30)
