[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / createMerkleProof

# Function: createMerkleProof()

> **createMerkleProof**(`trie`, `key`): `Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Defined in: [packages/mpt/src/proof/proof.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L37)

Creates a proof from a trie and key that can be verified using [verifyMPTWithMerkleProof](verifyMPTWithMerkleProof.md). An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains
the encoded trie nodes from the root node to the leaf node storing state data. The returned proof will be in the format of an array that contains Uint8Arrays of
serialized branch, extension, and/or leaf nodes.

## Parameters

### trie

[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)

### key

`Uint8Array`

key to create a proof for

## Returns

`Promise`\<[`Proof`](../type-aliases/Proof.md)\>
