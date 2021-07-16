[@ethereumjs/devp2p](../README.md) / [util](../modules/util.md) / Deferred

# Class: Deferred<T\>

[util](../modules/util.md).Deferred

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](util.deferred.md#constructor)

### Properties

- [promise](util.deferred.md#promise)
- [reject](util.deferred.md#reject)
- [resolve](util.deferred.md#resolve)

## Constructors

### constructor

• **new Deferred**<T\>()

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/devp2p/src/util.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L108)

## Properties

### promise

• **promise**: `Promise`<T\>

#### Defined in

[packages/devp2p/src/util.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L106)

___

### reject

• **reject**: (...`args`: `any`[]) => `any`

#### Type declaration

▸ (...`args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

#### Defined in

[packages/devp2p/src/util.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L108)

___

### resolve

• **resolve**: (...`args`: `any`[]) => `any`

#### Type declaration

▸ (...`args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

#### Defined in

[packages/devp2p/src/util.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L107)
