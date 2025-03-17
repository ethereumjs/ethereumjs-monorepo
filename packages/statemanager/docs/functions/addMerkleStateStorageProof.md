[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / addMerkleStateStorageProof

# Function: addMerkleStateStorageProof()

> **addMerkleStateStorageProof**(`sm`, `storageProof`, `storageHash`, `address`, `safe`): `Promise`\<`void`\>

Defined in: [proofs/merkle.ts:89](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/proofs/merkle.ts#L89)

Adds a storage proof to the state manager

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### storageProof

`StorageProof`[]

The storage proof

### storageHash

`` `0x${string}` ``

The root hash of the storage trie

### address

`Address`

The address

### safe

`boolean` = `false`

Whether or not to verify if the reported roots match the current storage root

## Returns

`Promise`\<`void`\>
