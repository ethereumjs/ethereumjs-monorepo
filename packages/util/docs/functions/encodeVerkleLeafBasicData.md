[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / encodeVerkleLeafBasicData

# Function: encodeVerkleLeafBasicData()

> **encodeVerkleLeafBasicData**(`account`): `Uint8Array`

Defined in: [packages/util/src/verkle.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L342)

This function takes a `VerkleLeafBasicData` object and encodes its properties
(version, nonce, code size, and balance) into a compact `Uint8Array` format. Each
property is serialized and padded to match the required byte lengths defined by
EIP-6800. Additionally, 4 bytes are reserved for future use as specified
in EIP-6800.

## Parameters

### account

[`Account`](../classes/Account.md)

## Returns

`Uint8Array`

- A compact bytes representation of the account header basic data.
