[merkle-patricia-tree](../README.md) / [Exports](../modules.md) / [util/walkController](../modules/util_walkController.md) / WalkController

# Class: WalkController

[util/walkController](../modules/util_walkController.md).WalkController

WalkController is an interface to control how the trie is being traversed.

## Table of contents

### Properties

- [onNode](util_walkController.WalkController.md#onnode)
- [taskExecutor](util_walkController.WalkController.md#taskexecutor)
- [trie](util_walkController.WalkController.md#trie)

### Methods

- [allChildren](util_walkController.WalkController.md#allchildren)
- [onlyBranchIndex](util_walkController.WalkController.md#onlybranchindex)
- [pushNodeToQueue](util_walkController.WalkController.md#pushnodetoqueue)
- [newWalk](util_walkController.WalkController.md#newwalk)

## Properties

### onNode

• `Readonly` **onNode**: [`FoundNodeFunction`](../modules/baseTrie.md#foundnodefunction)

#### Defined in

[util/walkController.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L10)

___

### taskExecutor

• `Readonly` **taskExecutor**: `PrioritizedTaskExecutor`

#### Defined in

[util/walkController.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L11)

___

### trie

• `Readonly` **trie**: [`Trie`](baseTrie.Trie.md)

#### Defined in

[util/walkController.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L12)

## Methods

### allChildren

▸ **allChildren**(`node`, `key?`): `void`

Run all children of a node. Priority of these nodes are the key length of the children.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `TrieNode` | `undefined` | Node to get all children of and call onNode on. |
| `key` | `Nibbles` | `[]` | The current `key` which would yield the `node` when trying to get this node with a `get` operation. |

#### Returns

`void`

#### Defined in

[util/walkController.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L67)

___

### onlyBranchIndex

▸ **onlyBranchIndex**(`node`, `key?`, `childIndex`, `priority?`): `void`

Push a branch of a certain BranchNode to the event queue.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `BranchNode` | `undefined` | The node to select a branch on. Should be a BranchNode. |
| `key` | `Nibbles` | `[]` | The current key which leads to the corresponding node. |
| `childIndex` | `number` | `undefined` | The child index to add to the event queue. |
| `priority?` | `number` | `undefined` | Optional priority of the event, defaults to the total key length. |

#### Returns

`void`

#### Defined in

[util/walkController.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L118)

___

### pushNodeToQueue

▸ **pushNodeToQueue**(`nodeRef`, `key?`, `priority?`): `void`

Push a node to the queue. If the queue has places left for tasks, the node is executed immediately, otherwise it is queued.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `nodeRef` | `Buffer` | `undefined` | Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`. |
| `key` | `Nibbles` | `[]` | The current key. |
| `priority?` | `number` | `undefined` | Optional priority, defaults to key length |

#### Returns

`void`

#### Defined in

[util/walkController.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L95)

___

### newWalk

▸ `Static` **newWalk**(`onNode`, `trie`, `root`, `poolSize?`): `Promise`<`void`\>

Async function to create and start a new walk over a trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onNode` | [`FoundNodeFunction`](../modules/baseTrie.md#foundnodefunction) | The `FoundNodeFunction to call if a node is found. |
| `trie` | [`Trie`](baseTrie.Trie.md) | The trie to walk on. |
| `root` | `Buffer` | The root key to walk on. |
| `poolSize?` | `number` | Task execution pool size to prevent OOM errors. Defaults to 500. |

#### Returns

`Promise`<`void`\>

#### Defined in

[util/walkController.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L37)
