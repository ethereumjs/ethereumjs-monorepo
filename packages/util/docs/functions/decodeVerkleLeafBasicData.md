[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / decodeVerkleLeafBasicData

# Function: decodeVerkleLeafBasicData()

> **decodeVerkleLeafBasicData**(`encodedBasicData`): [`VerkleLeafBasicData`](../type-aliases/VerkleLeafBasicData.md)

Defined in: [packages/util/src/verkle.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/verkle.ts#L309)

This function extracts and decodes account header elements (version, nonce, code size, and balance)
from an encoded `Uint8Array` representation of raw Verkle leaf-node basic data. Each component is sliced
from the `encodedBasicData` array based on predefined offsets and lengths, and then converted
to its appropriate type (integer or BigInt).

## Parameters

### encodedBasicData

`Uint8Array`

The encoded Verkle leaf basic data containing the version, nonce,
code size, and balance in a compact Uint8Array format.

## Returns

[`VerkleLeafBasicData`](../type-aliases/VerkleLeafBasicData.md)

- An object containing the decoded version, nonce, code size, and balance.
