[@ethereumjs/devp2p](../README.md) / Deferred

# Class: Deferred<T\>

## Type parameters

Name |
:------ |
`T` |

## Table of contents

### Constructors

- [constructor](deferred.md#constructor)

### Properties

- [promise](deferred.md#promise)
- [reject](deferred.md#reject)
- [resolve](deferred.md#resolve)

## Constructors

### constructor

\+ **new Deferred**<T\>(): [*Deferred*](deferred.md)<T\>

#### Type parameters:

Name |
:------ |
`T` |

**Returns:** [*Deferred*](deferred.md)<T\>

Defined in: [util.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L108)

## Properties

### promise

• **promise**: *Promise*<T\>

Defined in: [util.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L106)

___

### reject

• **reject**: (...`args`: *any*[]) => *any*

#### Type declaration:

▸ (...`args`: *any*[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *any*

Defined in: [util.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L108)

Defined in: [util.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L108)

___

### resolve

• **resolve**: (...`args`: *any*[]) => *any*

#### Type declaration:

▸ (...`args`: *any*[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`...args` | *any*[] |

**Returns:** *any*

Defined in: [util.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L107)

Defined in: [util.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L107)
