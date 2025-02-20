[@ethereumjs/verkle](../README.md) / WalkController

# Class: WalkController

WalkController is an interface to control how the tree is being traversed.

## Table of contents

### Properties

- [onNode](WalkController.md#onnode)
- [taskExecutor](WalkController.md#taskexecutor)
- [tree](WalkController.md#tree)

### Methods

- [allChildren](WalkController.md#allchildren)
- [pushChildrenAtIndex](WalkController.md#pushchildrenatindex)
- [pushNodeToQueue](WalkController.md#pushnodetoqueue)
- [newWalk](WalkController.md#newwalk)

## Properties

### onNode

• `Readonly` **onNode**: [`FoundNodeFunction`](../README.md#foundnodefunction)

#### Defined in

[util/walkController.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L13)

___

### taskExecutor

• `Readonly` **taskExecutor**: [`PrioritizedTaskExecutor`](PrioritizedTaskExecutor.md)

#### Defined in

[util/walkController.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L14)

___

### tree

• `Readonly` **tree**: [`VerkleTree`](VerkleTree.md)

#### Defined in

[util/walkController.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L15)

## Methods

### allChildren

▸ **allChildren**(`node`, `key?`): `void`

Run all children of a node. Priority of these nodes are the key length of the children.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`VerkleNode`](../README.md#verklenode) | Node to retrieve all children from of and call onNode on. |
| `key` | `Uint8Array` | The current `key` which would yield the `node` when trying to get this node with a `get` operation. |

#### Returns

`void`

#### Defined in

[util/walkController.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L70)

___

### pushChildrenAtIndex

▸ **pushChildrenAtIndex**(`node`, `key?`, `childIndex`, `priority?`): `void`

Push the child of an internal node to the event queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`InternalNode`](InternalNode.md) | The node to select a children from. Should be an InternalNode. |
| `key` | `Uint8Array` | The current key which leads to the corresponding node. |
| `childIndex` | `number` | The child index to add to the event queue. |
| `priority?` | `number` | Optional priority of the event, defaults to the total key length. |

#### Returns

`void`

#### Defined in

[util/walkController.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L117)

___

### pushNodeToQueue

▸ **pushNodeToQueue**(`nodeRef`, `key?`, `priority?`): `void`

Push a node to the queue. If the queue has places left for tasks, the node is executed immediately, otherwise it is queued.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeRef` | `Uint8Array` | Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`. |
| `key` | `Uint8Array` | The current key. |
| `priority?` | `number` | Optional priority, defaults to key length |

#### Returns

`void`

#### Defined in

[util/walkController.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L94)

___

### newWalk

▸ `Static` **newWalk**(`onNode`, `tree`, `root`, `poolSize?`): `Promise`<`void`\>

Async function to create and start a new walk over a tree.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onNode` | [`FoundNodeFunction`](../README.md#foundnodefunction) | The `FoundNodeFunction to call if a node is found. |
| `tree` | [`VerkleTree`](VerkleTree.md) | The tree to walk on. |
| `root` | `Uint8Array` | The root key to walk on. |
| `poolSize?` | `number` | Task execution pool size to prevent OOM errors. Defaults to 500. |

#### Returns

`Promise`<`void`\>

#### Defined in

[util/walkController.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/util/walkController.ts#L40)
