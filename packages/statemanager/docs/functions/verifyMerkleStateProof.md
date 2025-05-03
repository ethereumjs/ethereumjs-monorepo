[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / verifyMerkleStateProof

# Function: verifyMerkleStateProof()

> **verifyMerkleStateProof**(`sm`, `proof`): `Promise`\<`boolean`\>

Defined in: [proof/merkle.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/proof/merkle.ts#L187)

Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### proof

`Proof`

the proof to prove

## Returns

`Promise`\<`boolean`\>
