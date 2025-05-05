[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / getMerkleStateProof

# Function: getMerkleStateProof()

> **getMerkleStateProof**(`sm`, `address`, `storageSlots`): `Promise`\<`Proof`\>

Defined in: [proof/merkle.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/proof/merkle.ts#L35)

Get an EIP-1186 proof

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### address

`Address`

address to get proof of

### storageSlots

`Uint8Array`\<`ArrayBufferLike`\>[] = `[]`

storage slots to get proof of

## Returns

`Promise`\<`Proof`\>
