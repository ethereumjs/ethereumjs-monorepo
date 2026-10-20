[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / fromMerkleStateProof

# Function: fromMerkleStateProof()

> **fromMerkleStateProof**(`proof`, `safe?`, `opts?`): `Promise`\<[`MerkleStateManager`](../classes/MerkleStateManager.md)\>

Defined in: [proof/merkle.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/proof/merkle.ts#L119)

Create a [MerkleStateManager](../classes/MerkleStateManager.md) preloaded with EIP-1186 proof data.

Yields a partial manager from which all proven accounts and slots can be read.

## Parameters

### proof

`Proof` \| `Proof`[]

One proof or array of proofs from [getMerkleStateProof](getMerkleStateProof.md)

### safe?

`boolean` = `false`

When `true`, verify proof roots against reported account/storage roots

### opts?

[`MerkleStateManagerOpts`](../interfaces/MerkleStateManagerOpts.md) = `{}`

Options passed to the new [MerkleStateManager](../classes/MerkleStateManager.md)

## Returns

`Promise`\<[`MerkleStateManager`](../classes/MerkleStateManager.md)\>

Manager with proof nodes merged into its backing tries
