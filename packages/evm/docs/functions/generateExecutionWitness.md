[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / generateExecutionWitness

# Function: generateExecutionWitness()

> **generateExecutionWitness**(`stateManager`, `accessWitness`, `parentStateRoot`): `Promise`\<`VerkleExecutionWitness`\>

Defined in: [verkleAccessWitness.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/verkleAccessWitness.ts#L400)

Generate a VerkleExecutionWitness from a state manager and an access witness.

## Parameters

### stateManager

`StatefulVerkleStateManager`

The state manager containing the state to generate the witness for.

### accessWitness

[`VerkleAccessWitness`](../classes/VerkleAccessWitness.md)

The access witness containing the accessed states.

### parentStateRoot

`Uint8Array`

The parent state root (i.e. prestate root) to generate the witness for.

## Returns

`Promise`\<`VerkleExecutionWitness`\>

The generated verkle execution witness

Note: This does not provide the verkle proof, which is not implemented
