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

[packages/devp2p/src/util.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L104)

## Properties

### promise

• **promise**: `Promise`<`T`\>

#### Defined in

[packages/devp2p/src/util.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L101)

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

[packages/devp2p/src/util.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L103)

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

[packages/devp2p/src/util.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L102)
