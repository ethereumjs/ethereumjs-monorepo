[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / encodeBinaryTreeLeafBasicData

# Function: encodeBinaryTreeLeafBasicData()

> **encodeBinaryTreeLeafBasicData**(`account`): `Uint8Array`

Defined in: [packages/util/src/binaryTree.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/binaryTree.ts#L280)

This function takes a `BinaryTreeLeafBasicData` object and encodes its properties
(version, nonce, code size, and balance) into a compact `Uint8Array` format. Each
property is serialized and padded to match the required byte lengths defined by
EIP-7864. Additionally, 4 bytes are reserved for future use as specified
in EIP-7864.

## Parameters

### account

[`Account`](../classes/Account.md)

An object containing the version, nonce,
  code size, and balance to be encoded.

## Returns

`Uint8Array`

- A compact bytes representation of the account header basic data.
