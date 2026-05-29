[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / WalkController

# Class: WalkController

Defined in: [packages/mpt/src/util/walkController.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L14)

Interface to control how the trie is being traversed. Schedules node visits via a
prioritized task queue and invokes the provided callback for each node.

Used by [MerklePatriciaTrie.findPath](MerklePatriciaTrie.md#findpath), [MerklePatriciaTrie.walkTrie](MerklePatriciaTrie.md#walktrie), etc.

## Properties

### onNode

> `readonly` **onNode**: [`FoundNodeFunction`](../type-aliases/FoundNodeFunction.md)

Defined in: [packages/mpt/src/util/walkController.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L16)

The [FoundNodeFunction](../type-aliases/FoundNodeFunction.md) to call when a node is found.

***

### taskExecutor

> `readonly` **taskExecutor**: `PrioritizedTaskExecutor`

Defined in: [packages/mpt/src/util/walkController.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L19)

Task executor that prioritizes node visits (shorter paths first).

***

### trie

> `readonly` **trie**: [`MerklePatriciaTrie`](MerklePatriciaTrie.md)

Defined in: [packages/mpt/src/util/walkController.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L22)

The trie being walked.

## Methods

### allChildren()

> **allChildren**(`node`, `currentKeyNibbles`): `void`

Defined in: [packages/mpt/src/util/walkController.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L84)

Runs all children of a node. Priority of these nodes is the key length of the children.
Used when walking an Extension or when exploring all branches of a Branch node.

#### Parameters

##### node

[`MPTNode`](../type-aliases/MPTNode.md)

Node to get all children of and call onNode on.

##### currentKeyNibbles

[`Nibbles`](../type-aliases/Nibbles.md) = `[]`

The current key (nibbles) which would yield the `node` when
       trying to get this node with a `get` operation. Defaults to `[]`.

#### Returns

`void`

`void`

***

### onlyBranchIndex()

> **onlyBranchIndex**(`node`, `currentKeyNibbles`, `childIndex`, `priority?`): `void`

Defined in: [packages/mpt/src/util/walkController.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L144)

Pushes a branch of a certain BranchMPTNode to the event queue.
Used by findPath when following a specific key (only one child index is traversed).

#### Parameters

##### node

[`BranchMPTNode`](BranchMPTNode.md)

The BranchMPTNode to select a branch on.

##### currentKeyNibbles

[`Nibbles`](../type-aliases/Nibbles.md) = `[]`

The current key which leads to the corresponding node. Defaults to `[]`.

##### childIndex

`number`

The child index (0–15) to add to the event queue.

##### priority?

`number`

Optional priority of the event. Defaults to the total key length.

#### Returns

`void`

`void`

#### Throws

If `node` is not a BranchMPTNode or if the branch at `childIndex` is empty.

***

### pushNodeToQueue()

> **pushNodeToQueue**(`nodeRef`, `currentKeyNibbles`, `priority?`): `void`

Defined in: [packages/mpt/src/util/walkController.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L114)

Pushes a node to the queue. If the queue has capacity, the node is executed immediately,
otherwise it is queued for later execution.

#### Parameters

##### nodeRef

[`NodeReferenceOrRawMPTNode`](../type-aliases/NodeReferenceOrRawMPTNode.md)

A node reference (32-byte keccak hash or raw encoding) to enqueue.

##### currentKeyNibbles

[`Nibbles`](../type-aliases/Nibbles.md) = `[]`

The current key (nibbles) corresponding to this node. Defaults to `[]`.

##### priority?

`number`

Optional priority. Defaults to key length.

#### Returns

`void`

`void`

***

### newWalk()

> `static` **newWalk**(`onNode`, `trie`, `rootHash`, `poolSize?`): `Promise`\<`void`\>

Defined in: [packages/mpt/src/util/walkController.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/util/walkController.ts#L50)

Creates and starts an async walk over a trie from the given root.
Resolves when all reachable nodes have been visited and no new tasks were scheduled.

#### Parameters

##### onNode

[`FoundNodeFunction`](../type-aliases/FoundNodeFunction.md)

The [FoundNodeFunction](../type-aliases/FoundNodeFunction.md) to call when a node is found.

##### trie

[`MerklePatriciaTrie`](MerklePatriciaTrie.md)

The trie to walk on.

##### rootHash

`Uint8Array`

The root hash (32-byte keccak) to start walking from.

##### poolSize?

`number`

Task execution pool size to prevent OOM errors. Defaults to 500.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the walk is finished.
