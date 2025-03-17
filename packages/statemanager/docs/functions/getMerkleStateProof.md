[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / getMerkleStateProof

# Function: getMerkleStateProof()

> **getMerkleStateProof**(`sm`, `address`, `storageSlots`): `Promise`\<`Proof`\>

Defined in: [proofs/merkle.ts:34](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/proofs/merkle.ts#L34)

Get an EIP-1186 proof

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### address

`Address`

address to get proof of

### storageSlots

`Uint8Array`[] = `[]`

storage slots to get proof of

## Returns

`Promise`\<`Proof`\>
