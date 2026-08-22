[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / StatefulBinaryTreeStateManagerOpts

# Interface: StatefulBinaryTreeStateManagerOpts

Defined in: [types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L77)

Options for constructing a [StatefulBinaryTreeStateManager](../classes/StatefulBinaryTreeStateManager.md).

## Extends

- `BaseStateManagerOpts`

## Properties

### caches?

> `optional` **caches?**: [`Caches`](../classes/Caches.md)

Defined in: [types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L83)

Read-through caches for account, code, and storage.

***

### common?

> `optional` **common?**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L14)

The common to use

#### Inherited from

`BaseStateManagerOpts.common`

***

### hashFunction?

> `optional` **hashFunction?**: (`data`) => `Uint8Array`

Defined in: [types.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L79)

Node hash function (defaults to the tree's hash function).

#### Parameters

##### data

`Uint8Array`

#### Returns

`Uint8Array`

***

### tree?

> `optional` **tree?**: [`BinaryTree`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/docs/classes/BinaryTree.md)

Defined in: [types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L81)

Pre-existing [BinaryTree](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/docs/classes/BinaryTree.md) instance.
