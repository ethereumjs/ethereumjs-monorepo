[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / addMerkleStateProofData

# Function: addMerkleStateProofData()

> **addMerkleStateProofData**(`sm`, `proof`, `safe?`): `Promise`\<`void`\>

Defined in: [proof/merkle.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/proof/merkle.ts#L162)

Add proof(s) into an already existing trie.

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### proof

`Proof` \| `Proof`[]

The proof(s) retrieved from `getProof`

### safe?

`boolean` = `false`

When `false`, skip verifying that proof roots match the trie root (useful when
merging proofs from different state roots)

## Returns

`Promise`\<`void`\>
