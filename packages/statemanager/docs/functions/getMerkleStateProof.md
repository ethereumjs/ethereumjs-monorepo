[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / getMerkleStateProof

# Function: getMerkleStateProof()

> **getMerkleStateProof**(`sm`, `address`, `storageSlots?`): `Promise`\<`Proof`\>

Defined in: [proof/merkle.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/proof/merkle.ts#L36)

Build an EIP-1186 proof from a [MerkleStateManager](../classes/MerkleStateManager.md).

## Parameters

### sm

[`MerkleStateManager`](../classes/MerkleStateManager.md)

### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Account to prove

### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[] = `[]`

Storage keys to include in the proof (defaults to none)

## Returns

`Promise`\<`Proof`\>
