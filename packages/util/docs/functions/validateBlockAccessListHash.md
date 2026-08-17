[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / validateBlockAccessListHash

# Function: validateBlockAccessListHash()

> **validateBlockAccessListHash**(`bal`, `expectedHash`): `void`

Defined in: [packages/util/src/bal/validation.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/validation.ts#L142)

Verifies `keccak256(rlp(bal))` matches the committed header hash.

## Parameters

### bal

[`BlockLevelAccessList`](../classes/BlockLevelAccessList.md)

### expectedHash

`Uint8Array`

## Returns

`void`

## Remarks

Experimental (Amsterdam): may change on patch releases.
