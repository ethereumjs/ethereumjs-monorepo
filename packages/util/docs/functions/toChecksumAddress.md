[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / toChecksumAddress

# Function: toChecksumAddress()

> **toChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `` `0x${string}` ``

Defined in: [packages/util/src/account.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L408)

Returns a checksummed address.

If an eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details see [EIP-1191](https://eips.ethereum.org/EIPS/eip-1191).

WARNING: Checksums with and without the chainId will differ and the EIP-1191 checksum is not
backwards compatible to the original widely adopted checksum format standard introduced in
[EIP-55](https://eips.ethereum.org/EIPS/eip-55), so this will break in existing applications.
Usage of this EIP is therefore discouraged unless you have a very targeted use case.

## Parameters

### hexAddress

`string`

### eip1191ChainId?

[`BigIntLike`](../type-aliases/BigIntLike.md)

## Returns

`` `0x${string}` ``
