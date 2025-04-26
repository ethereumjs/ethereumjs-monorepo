[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / WalkController

# Class: WalkController

Defined in: [packages/mpt/src/util/walkController.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L11)

WalkController is an interface to control how the trie is being traversed.

## Properties

### onNode

> `readonly` **onNode**: [`FoundNodeFunction`](../type-aliases/FoundNodeFunction.md)

Defined in: [packages/mpt/src/util/walkController.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L12)

***

### taskExecutor

> `readonly` **taskExecutor**: `PrioritizedTaskExecutor`

Defined in: [packages/mpt/src/util/walkController.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L13)

***

### trie

> `readonly` **trie**: [`MerklePatriciaTrie`](MerklePatriciaTrie.md)

Defined in: [packages/mpt/src/util/walkController.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L14)

## Methods

### allChildren()

> **allChildren**(`node`, `key`): `void`

Defined in: [packages/mpt/src/util/walkController.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L69)

Run all children of a node. Priority of these nodes are the key length of the children.

#### Parameters

##### node

[`MPTNode`](../type-aliases/MPTNode.md)

Node to get all children of and call onNode on.

##### key

[`Nibbles`](../type-aliases/Nibbles.md) = `[]`

The current `key` which would yield the `node` when trying to get this node with a `get` operation.

#### Returns

`void`

***

### onlyBranchIndex()

> **onlyBranchIndex**(`node`, `key`, `childIndex`, `priority?`): `void`

Defined in: [packages/mpt/src/util/walkController.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L120)

Push a branch of a certain BranchMPTNode to the event queue.

#### Parameters

##### node

[`BranchMPTNode`](BranchMPTNode.md)

The node to select a branch on. Should be a BranchMPTNode.

##### key

[`Nibbles`](../type-aliases/Nibbles.md) = `[]`

The current key which leads to the corresponding node.

##### childIndex

`number`

The child index to add to the event queue.

##### priority?

`number`

Optional priority of the event, defaults to the total key length.

#### Returns

`void`

***

### pushNodeToQueue()

> **pushNodeToQueue**(`nodeRef`, `key`, `priority?`): `void`

Defined in: [packages/mpt/src/util/walkController.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L97)

Push a node to the queue. If the queue has places left for tasks, the node is executed immediately, otherwise it is queued.

#### Parameters

##### nodeRef

`Uint8Array`

Push a node reference to the event queue. This reference is a 32-byte keccak hash of the value corresponding to the `key`.

##### key

[`Nibbles`](../type-aliases/Nibbles.md) = `[]`

The current key.

##### priority?

`number`

Optional priority, defaults to key length

#### Returns

`void`

***

### newWalk()

> `static` **newWalk**(`onNode`, `trie`, `root`, `poolSize?`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/util/walkController.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L39)

Async function to create and start a new walk over a trie.

#### Parameters

##### onNode

[`FoundNodeFunction`](../type-aliases/FoundNodeFunction.md)

The `FoundNodeFunction to call if a node is found.

##### trie

[`MerklePatriciaTrie`](MerklePatriciaTrie.md)

The trie to walk on.

##### root

`Uint8Array`

The root key to walk on.

##### poolSize?

`number`

Task execution pool size to prevent OOM errors. Defaults to 500.

#### Returns

`Promise`\<`void`\>
