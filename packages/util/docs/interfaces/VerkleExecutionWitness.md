[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / VerkleExecutionWitness

# Interface: VerkleExecutionWitness

Defined in: [packages/util/src/verkle.ts:123](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L123)

Experimental, object format could eventual change.
An object that provides the state and proof necessary for verkle stateless execution

## Properties

### parentStateRoot

> **parentStateRoot**: `` `0x${string}` ``

Defined in: [packages/util/src/verkle.ts:127](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L127)

The stateRoot of the parent block

***

### stateDiff

> **stateDiff**: [`VerkleStateDiff`](VerkleStateDiff.md)[]

Defined in: [packages/util/src/verkle.ts:133](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L133)

An array of state diffs.
Each item corresponding to state accesses or state modifications of the block.
In the current design, it also contains the resulting state of the block execution (post-state).

***

### verkleProof

> **verkleProof**: [`VerkleProof`](VerkleProof.md)

Defined in: [packages/util/src/verkle.ts:138](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L138)

The verkle proof for the block.
Proves that the provided stateDiff belongs to the canonical verkle tree.
