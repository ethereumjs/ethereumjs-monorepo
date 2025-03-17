[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / fromMerkleStateProof

# Function: fromMerkleStateProof()

> **fromMerkleStateProof**(`proof`, `safe`, `opts`): `Promise`\<[`MerkleStateManager`](../classes/MerkleStateManager.md)\>

Defined in: [proofs/merkle.ts:115](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/proofs/merkle.ts#L115)

Create a StateManager and initialize this with proof(s) gotten previously from getProof
This generates a (partial) StateManager where one can retrieve all items from the proof

## Parameters

### proof

Either a proof retrieved from `getProof`, or an array of those proofs

`Proof` | `Proof`[]

### safe

`boolean` = `false`

Whether or not to verify that the roots of the proof items match the reported roots

### opts

[`MerkleStateManagerOpts`](../interfaces/MerkleStateManagerOpts.md) = `{}`

a dictionary of StateManager opts

## Returns

`Promise`\<[`MerkleStateManager`](../classes/MerkleStateManager.md)\>

A new MerkleStateManager with elements from the given proof included in its backing state trie
