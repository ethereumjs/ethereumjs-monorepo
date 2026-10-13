[**@ethereumjs/rlp**](../README.md)

***

[@ethereumjs/rlp](../README.md) / decode

# Function: decode()

decode helper.

## Call Signature

> **decode**(`input`, `stream?`): [`NestedUint8Array`](../type-aliases/NestedUint8Array.md) \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/rlp/src/index.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L304)

RLP-decode a byte payload, optionally returning unconsumed trailing bytes.

### Parameters

#### input

[`Input`](../type-aliases/Input.md)

#### stream?

`false`

When true, return a [Decoded](../interfaces/Decoded.md) object instead of throwing on trailing data

### Returns

[`NestedUint8Array`](../type-aliases/NestedUint8Array.md) \| `Uint8Array`\<`ArrayBufferLike`\>

### Throws

If non-stream decoding leaves a non-empty remainder

### See

https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/

## Call Signature

> **decode**(`input`, `stream?`): [`Decoded`](../interfaces/Decoded.md)

Defined in: [packages/rlp/src/index.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L306)

decode helper.

### Parameters

#### input

[`Input`](../type-aliases/Input.md)

#### stream?

`true`

### Returns

[`Decoded`](../interfaces/Decoded.md)
