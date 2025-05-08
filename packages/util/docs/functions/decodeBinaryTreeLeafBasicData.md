[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / decodeBinaryTreeLeafBasicData

# Function: decodeBinaryTreeLeafBasicData()

> **decodeBinaryTreeLeafBasicData**(`encodedBasicData`): [`BinaryTreeLeafBasicData`](../type-aliases/BinaryTreeLeafBasicData.md)

Defined in: [packages/util/src/binaryTree.ts:245](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L245)

This function extracts and decodes account header elements (version, nonce, code size, and balance)
from an encoded `Uint8Array` representation of raw BinaryTree leaf-node basic data. Each component is sliced
from the `encodedBasicData` array based on predefined offsets and lengths, and then converted
to its appropriate type (integer or BigInt).

## Parameters

### encodedBasicData

`Uint8Array`

The encoded BinaryTree leaf basic data containing the version, nonce,
code size, and balance in a compact Uint8Array format.

## Returns

[`BinaryTreeLeafBasicData`](../type-aliases/BinaryTreeLeafBasicData.md)

- An object containing the decoded version, nonce, code size, and balance.
