[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / verifyMPTWithMerkleProof

# Function: verifyMPTWithMerkleProof()

> **verifyMPTWithMerkleProof**(`trie`, `rootHash`, `key`, `proof`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [packages/mpt/src/proof/proof.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L96)

Verifies a proof by putting all of its nodes into a trie and attempting to get the proven key. An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof
contains the encoded trie nodes from the root node to the leaf node storing state data.

## Parameters

### trie

[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)

The trie to verify the proof against

### rootHash

`Uint8Array`

Root hash of the trie that this proof was created from and is being verified for

### key

`Uint8Array`

Key that is being verified and that the proof is created for

### proof

[`Proof`](../type-aliases/Proof.md)

an EIP-1186 proof to verify the key against

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

The value from the key, or null if valid proof of non-existence.

## Throws

If proof is found to be invalid.
