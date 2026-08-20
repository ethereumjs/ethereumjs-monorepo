[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / createMerkleProof

# Function: createMerkleProof()

> **createMerkleProof**(`trie`, `key`): `Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Defined in: [proof/proof.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L37)

Build an EIP-1186 proof for `key` from a full trie.

## Parameters

### trie

[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)

Source trie (must contain the key path)

### key

`Uint8Array`

Key to prove

## Returns

`Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Serialized nodes along the path from root to leaf
