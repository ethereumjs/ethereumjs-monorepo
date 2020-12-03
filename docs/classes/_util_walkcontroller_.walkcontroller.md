[merkle-patricia-tree](../README.md) › ["util/walkController"](../modules/_util_walkcontroller_.md) › [WalkController](_util_walkcontroller_.walkcontroller.md)

# Class: WalkController

WalkController is an interface to control how the trie is being traversed.

## Hierarchy

* **WalkController**

## Index

### Properties

* [onNode](_util_walkcontroller_.walkcontroller.md#onnode)
* [taskExecutor](_util_walkcontroller_.walkcontroller.md#taskexecutor)
* [trie](_util_walkcontroller_.walkcontroller.md#trie)

### Methods

* [allChildren](_util_walkcontroller_.walkcontroller.md#allchildren)
* [onlyBranchIndex](_util_walkcontroller_.walkcontroller.md#onlybranchindex)
* [pushNode](_util_walkcontroller_.walkcontroller.md#pushnode)
* [newWalk](_util_walkcontroller_.walkcontroller.md#static-newwalk)

## Properties

###  onNode

• **onNode**: *[FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction)*

*Defined in [util/walkController.ts:10](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L10)*

___

###  taskExecutor

• **taskExecutor**: *PrioritizedTaskExecutor*

*Defined in [util/walkController.ts:11](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L11)*

___

###  trie

• **trie**: *BaseTrie*

*Defined in [util/walkController.ts:12](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L12)*

## Methods

###  allChildren

▸ **allChildren**(`node`: TrieNode, `key`: Nibbles): *void*

*Defined in [util/walkController.ts:63](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L63)*

Run all children of a node. Priority of these nodes are the key length of the children

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | TrieNode | - | Node to get all children of and call onNode on |
`key` | Nibbles | [] | The current `key` which would yield the `node` when trying to get this node with a `get` operation.  |

**Returns:** *void*

___

###  onlyBranchIndex

▸ **onlyBranchIndex**(`node`: BranchNode, `key`: Nibbles, `childIndex`: number, `priority?`: undefined | number): *Promise‹void›*

*Defined in [util/walkController.ts:106](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L106)*

Push a branch of a certain BranchNode to the event queue

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`node` | BranchNode | - | The node to select a branch on. Should be a BranchNode |
`key` | Nibbles | [] | The current key which leads to the corresponding node |
`childIndex` | number | - | The child index to add to the event queue |
`priority?` | undefined &#124; number | - | Optional priority of the event, defaults to the total key length  |

**Returns:** *Promise‹void›*

___

###  pushNode

▸ **pushNode**(`nodeRef`: Buffer, `key`: Nibbles, `priority?`: undefined | number): *void*

*Defined in [util/walkController.ts:91](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L91)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nodeRef` | Buffer | - | Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`. |
`key` | Nibbles | [] | The current key. |
`priority?` | undefined &#124; number | - | Optional priority, defaults to key length  |

**Returns:** *void*

___

### `Static` newWalk

▸ **newWalk**(`onNode`: [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction), `trie`: BaseTrie, `root`: Buffer, `poolSize?`: undefined | number): *Promise‹void›*

*Defined in [util/walkController.ts:34](https://github.com/ethereumjs/merkle-patricia-tree/blob/master/src/util/walkController.ts#L34)*

Async function to create and start a new walk over a trie.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`onNode` | [FoundNodeFunction](../modules/_basetrie_.md#foundnodefunction) | The `FoundNodeFunction to call if a node is found |
`trie` | BaseTrie | The trie to walk on |
`root` | Buffer | The root key to walk on |
`poolSize?` | undefined &#124; number | Task execution pool size to prevent OOM errors. Defaults to 500.  |

**Returns:** *Promise‹void›*
