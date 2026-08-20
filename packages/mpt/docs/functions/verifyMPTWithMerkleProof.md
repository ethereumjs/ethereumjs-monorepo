[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / verifyMPTWithMerkleProof

# Function: verifyMPTWithMerkleProof()

> **verifyMPTWithMerkleProof**(`trie`, `rootHash`, `key`, `proof`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [proof/proof.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L95)

Verify a proof by loading nodes into a scratch trie and reading the key.

## Parameters

### trie

[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)

Reference trie (supplies key-hashing options)

### rootHash

`Uint8Array`

Expected root hash of the proven trie

### key

`Uint8Array`

Key whose value is being verified

### proof

[`Proof`](../type-aliases/Proof.md)

EIP-1186 proof nodes

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Proven value, or `null` for a valid non-existence proof

## Throws

If the proof is invalid
