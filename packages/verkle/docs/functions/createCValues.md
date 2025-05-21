[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / createCValues

# Function: createCValues()

> **createCValues**(`values`): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [node/util.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/util.ts#L56)

Converts 128 32byte values of a leaf node into an array of 256 32 byte values representing
the first and second 16 bytes of each value right padded with zeroes for generating a
commitment for half of a leaf node's values

## Parameters

### values

(`Uint8Array`\<`ArrayBufferLike`\> \| [`LeafVerkleNodeValue`](../type-aliases/LeafVerkleNodeValue.md))[]

an array of Uint8Arrays representing the first or second set of 128 values
stored by the verkle trie leaf node
Returns an array of 256 32 byte UintArrays with the leaf marker set for each value that is
deleted

## Returns

`Uint8Array`\<`ArrayBufferLike`\>[]
