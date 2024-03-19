[@ethereumjs/block](../README.md) / VerkleExecutionWitness

# Interface: VerkleExecutionWitness

Experimental, object format could eventual change.
An object that provides the state and proof necessary for verkle stateless execution

## Table of contents

### Properties

- [stateDiff](VerkleExecutionWitness.md#statediff)
- [verkleProof](VerkleExecutionWitness.md#verkleproof)

## Properties

### stateDiff

• **stateDiff**: [`VerkleStateDiff`](VerkleStateDiff.md)[]

An array of state diffs.
Each item corresponding to state accesses or state modifications of the block.
In the current design, it also contains the resulting state of the block execution (post-state).

#### Defined in

[types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L105)

___

### verkleProof

• **verkleProof**: [`VerkleProof`](VerkleProof.md)

The verkle proof for the block.
Proves that the provided stateDiff belongs to the canonical verkle tree.

#### Defined in

[types.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L110)
