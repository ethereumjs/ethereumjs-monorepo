[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / BinaryTreeExecutionWitness

# Interface: BinaryTreeExecutionWitness

Defined in: [packages/util/src/binaryTree.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L58)

Experimental, object format could eventual change.
An object that provides the state and proof necessary for binary tree stateless execution

## Properties

### parentStateRoot

> **parentStateRoot**: `` `0x${string}` ``

Defined in: [packages/util/src/binaryTree.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L62)

The stateRoot of the parent block

***

### proof

> **proof**: `any`

Defined in: [packages/util/src/binaryTree.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L73)

The proof for the block.
Proves that the provided stateDiff belongs to the canonical binary tree.

***

### stateDiff

> **stateDiff**: [`BinaryTreeStateDiff`](BinaryTreeStateDiff.md)[]

Defined in: [packages/util/src/binaryTree.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L68)

An array of state diffs.
Each item corresponding to state accesses or state modifications of the block.
In the current design, it also contains the resulting state of the block execution (post-state).
