[@ethereumjs/devp2p](../README.md) / Deferred

# Class: Deferred<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](Deferred.md#constructor)

### Properties

- [promise](Deferred.md#promise)
- [reject](Deferred.md#reject)
- [resolve](Deferred.md#resolve)

## Constructors

### constructor

• **new Deferred**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/devp2p/src/util.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L119)

## Properties

### promise

• **promise**: `Promise`<`T`\>

#### Defined in

[packages/devp2p/src/util.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L116)

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

[packages/devp2p/src/util.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L118)

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

[packages/devp2p/src/util.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L117)
