[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / generateBinaryExecutionWitness

# Function: generateBinaryExecutionWitness()

> **generateBinaryExecutionWitness**(`stateManager`, `accessWitness`, `parentStateRoot`): `Promise`\<`BinaryTreeExecutionWitness`\>

Defined in: [binaryTreeAccessWitness.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/binaryTreeAccessWitness.ts#L395)

Generate a BinaryTreeExecutionWitness from a state manager and an access witness.

## Parameters

### stateManager

`BinaryTreeStateManagerInterface`

The state manager containing the state to generate the witness for.
Any state manager exposing the binary tree surface works (see
BinaryTreeStateManagerInterface), e.g. `StatefulBinaryTreeStateManager`
from `@ethereumjs/statemanager`.

### accessWitness

[`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

The access witness containing the accessed states.

### parentStateRoot

`Uint8Array`

The parent state root (i.e. prestate root) to generate the witness for.

## Returns

`Promise`\<`BinaryTreeExecutionWitness`\>

The generated binary tree execution witness
