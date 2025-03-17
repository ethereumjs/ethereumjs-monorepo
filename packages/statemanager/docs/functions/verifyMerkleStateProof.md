[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / verifyMerkleStateProof

# Function: verifyMerkleStateProof()

> **verifyMerkleStateProof**(`sm`, `proof`): `Promise`\<`boolean`\>

Defined in: [proofs/merkle.ts:186](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/proofs/merkle.ts#L186)

Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### proof

`Proof`

the proof to prove

## Returns

`Promise`\<`boolean`\>
