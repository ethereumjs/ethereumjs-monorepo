[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / updateMPTFromMerkleProof

# Function: updateMPTFromMerkleProof()

> **updateMPTFromMerkleProof**(`trie`, `proof`, `shouldVerifyRoot?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Defined in: [proof/proof.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L55)

Populate a trie from an EIP-1186 proof by batch-putting all proof nodes.

## Parameters

### trie

[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)

Trie to update (typically empty or sparse)

### proof

[`Proof`](../type-aliases/Proof.md)

Serialized nodes from root to leaf

### shouldVerifyRoot?

`boolean` = `false`

When `true`, require the first proof node's hash to match `trie.root()`

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Root hash derived from the first proof node
