[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / hashBlockAccessListFromJSON

# Function: hashBlockAccessListFromJSON()

> **hashBlockAccessListFromJSON**(`json`): `Uint8Array`

Defined in: [packages/util/src/bal/validation.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/validation.ts#L105)

`keccak256(rlp(bal))` using the JSON account order (not re-sorted), matching Engine API bytes.

## Parameters

### json

[`BALJSONBlockAccessList`](../type-aliases/BALJSONBlockAccessList.md)

## Returns

`Uint8Array`

## Remarks

Experimental (Amsterdam): may change on patch releases.
