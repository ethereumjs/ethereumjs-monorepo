[merkle-patricia-tree](../README.md) / WalkController

# Class: WalkController

WalkController is an interface to control how the trie is being traversed.

## Table of contents

### Properties

- [onNode](walkcontroller.md#onnode)
- [taskExecutor](walkcontroller.md#taskexecutor)
- [trie](walkcontroller.md#trie)

### Methods

- [allChildren](walkcontroller.md#allchildren)
- [onlyBranchIndex](walkcontroller.md#onlybranchindex)
- [pushNodeToQueue](walkcontroller.md#pushnodetoqueue)
- [newWalk](walkcontroller.md#newwalk)

## Properties

### onNode

• `Readonly` **onNode**: FoundNodeFunction

Defined in: [util/walkController.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L10)

___

### taskExecutor

• `Readonly` **taskExecutor**: *PrioritizedTaskExecutor*

Defined in: [util/walkController.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L11)

___

### trie

• `Readonly` **trie**: [*BaseTrie*](basetrie.md)

Defined in: [util/walkController.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L12)

## Methods

### allChildren

▸ **allChildren**(`node`: TrieNode, `key?`: Nibbles): *void*

Run all children of a node. Priority of these nodes are the key length of the children.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | TrieNode | - | Node to get all children of and call onNode on. |
| `key` | Nibbles | [] | The current `key` which would yield the `node` when trying to get this node with a `get` operation. |

**Returns:** *void*

Defined in: [util/walkController.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L59)

___

### onlyBranchIndex

▸ **onlyBranchIndex**(`node`: *BranchNode*, `key?`: Nibbles, `childIndex`: *number*, `priority?`: *number*): *void*

Push a branch of a certain BranchNode to the event queue.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | *BranchNode* | - | The node to select a branch on. Should be a BranchNode. |
| `key` | Nibbles | [] | The current key which leads to the corresponding node. |
| `childIndex` | *number* | - | The child index to add to the event queue. |
| `priority?` | *number* | - | Optional priority of the event, defaults to the total key length. |

**Returns:** *void*

Defined in: [util/walkController.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L105)

___

### pushNodeToQueue

▸ **pushNodeToQueue**(`nodeRef`: *Buffer*, `key?`: Nibbles, `priority?`: *number*): *void*

Push a node to the queue. If the queue has places left for tasks, the node is executed immediately, otherwise it is queued.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `nodeRef` | *Buffer* | - | Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`. |
| `key` | Nibbles | [] | The current key. |
| `priority?` | *number* | - | Optional priority, defaults to key length |

**Returns:** *void*

Defined in: [util/walkController.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L87)

___

### newWalk

▸ `Static` **newWalk**(`onNode`: FoundNodeFunction, `trie`: [*BaseTrie*](basetrie.md), `root`: *Buffer*, `poolSize?`: *number*): *Promise*<void\>

Async function to create and start a new walk over a trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onNode` | FoundNodeFunction | The `FoundNodeFunction to call if a node is found. |
| `trie` | [*BaseTrie*](basetrie.md) | The trie to walk on. |
| `root` | *Buffer* | The root key to walk on. |
| `poolSize?` | *number* | Task execution pool size to prevent OOM errors. Defaults to 500. |

**Returns:** *Promise*<void\>

Defined in: [util/walkController.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/util/walkController.ts#L35)
