[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / updateMPTFromMerkleProof

# Function: updateMPTFromMerkleProof()

> **updateMPTFromMerkleProof**(`trie`, `proof`, `shouldVerifyRoot`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Defined in: [packages/mpt/src/proof/proof.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L56)

Updates a trie from a proof by putting all the nodes in the proof into the trie. Pass shouldVerifyRoot as true to check
that root key of proof matches root of trie and throw if not.
An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

## Parameters

### trie

[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)

The trie to update from the proof.

### proof

[`Proof`](../type-aliases/Proof.md)

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof to update the trie from.

### shouldVerifyRoot

`boolean` = `false`

defaults to false. If `true`, verifies that the root key of the proof matches the trie root and throws if not (i.e invalid proof).

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

The root of the proof
