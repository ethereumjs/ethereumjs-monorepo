[**@ethereumjs/rlp**](../README.md)

***

[@ethereumjs/rlp](../README.md) / Decoded

# Interface: Decoded

Defined in: [packages/rlp/src/index.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L12)

Result of streaming RLP decode ([decode](../functions/decode.md) with `stream: true`).

## Properties

### data

> **data**: [`NestedUint8Array`](../type-aliases/NestedUint8Array.md) \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/rlp/src/index.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L14)

Decoded payload (byte string or nested list)

***

### remainder

> **remainder**: `Uint8Array`

Defined in: [packages/rlp/src/index.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L16)

Unconsumed trailing bytes after the decoded item
