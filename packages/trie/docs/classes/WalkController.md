[@ethereumjs/trie](../README.md) / WalkController

# Class: WalkController

WalkController is an interface to control how the trie is being traversed.

## Table of contents

### Properties

- [onNode](WalkController.md#onnode)
- [taskExecutor](WalkController.md#taskexecutor)
- [trie](WalkController.md#trie)

### Methods

- [allChildren](WalkController.md#allchildren)
- [onlyBranchIndex](WalkController.md#onlybranchindex)
- [pushNodeToQueue](WalkController.md#pushnodetoqueue)
- [newWalk](WalkController.md#newwalk)

## Properties

### onNode

• `Readonly` **onNode**: [`FoundNodeFunction`](../README.md#foundnodefunction)

#### Defined in

[packages/trie/src/util/walkController.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L10)

___

### taskExecutor

• `Readonly` **taskExecutor**: [`PrioritizedTaskExecutor`](PrioritizedTaskExecutor.md)

#### Defined in

[packages/trie/src/util/walkController.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L11)

___

### trie

• `Readonly` **trie**: [`Trie`](Trie.md)

#### Defined in

[packages/trie/src/util/walkController.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L12)

## Methods

### allChildren

▸ **allChildren**(`node`, `key?`): `void`

Run all children of a node. Priority of these nodes are the key length of the children.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | [`TrieNode`](../README.md#trienode) | `undefined` | Node to get all children of and call onNode on. |
| `key` | [`Nibbles`](../README.md#nibbles) | `[]` | The current `key` which would yield the `node` when trying to get this node with a `get` operation. |

#### Returns

`void`

#### Defined in

[packages/trie/src/util/walkController.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L67)

___

### onlyBranchIndex

▸ **onlyBranchIndex**(`node`, `key?`, `childIndex`, `priority?`): `void`

Push a branch of a certain BranchNode to the event queue.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | [`BranchNode`](BranchNode.md) | `undefined` | The node to select a branch on. Should be a BranchNode. |
| `key` | [`Nibbles`](../README.md#nibbles) | `[]` | The current key which leads to the corresponding node. |
| `childIndex` | `number` | `undefined` | The child index to add to the event queue. |
| `priority?` | `number` | `undefined` | Optional priority of the event, defaults to the total key length. |

#### Returns

`void`

#### Defined in

[packages/trie/src/util/walkController.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L118)

___

### pushNodeToQueue

▸ **pushNodeToQueue**(`nodeRef`, `key?`, `priority?`): `void`

Push a node to the queue. If the queue has places left for tasks, the node is executed immediately, otherwise it is queued.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `nodeRef` | `Buffer` | `undefined` | Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`. |
| `key` | [`Nibbles`](../README.md#nibbles) | `[]` | The current key. |
| `priority?` | `number` | `undefined` | Optional priority, defaults to key length |

#### Returns

`void`

#### Defined in

[packages/trie/src/util/walkController.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L95)

___

### newWalk

▸ `Static` **newWalk**(`onNode`, `trie`, `root`, `poolSize?`): `Promise`<`void`\>

Async function to create and start a new walk over a trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onNode` | [`FoundNodeFunction`](../README.md#foundnodefunction) | The `FoundNodeFunction to call if a node is found. |
| `trie` | [`Trie`](Trie.md) | The trie to walk on. |
| `root` | `Buffer` | The root key to walk on. |
| `poolSize?` | `number` | Task execution pool size to prevent OOM errors. Defaults to 500. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/trie/src/util/walkController.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L37)
