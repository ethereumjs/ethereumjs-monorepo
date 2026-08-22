[**@ethereumjs/rlp**](../README.md)

***

[@ethereumjs/rlp](../README.md) / RLP

# Variable: RLP

> `const` **RLP**: `object`

Defined in: [packages/rlp/src/index.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts#L338)

Namespace object exposing [encode](../functions/encode.md) and [decode](../functions/decode.md).

## Type Declaration

### decode

> **decode**: \{(`input`, `stream?`): [`NestedUint8Array`](../type-aliases/NestedUint8Array.md) \| `Uint8Array`\<`ArrayBufferLike`\>; (`input`, `stream?`): [`Decoded`](../interfaces/Decoded.md); \}

#### Call Signature

> (`input`, `stream?`): [`NestedUint8Array`](../type-aliases/NestedUint8Array.md) \| `Uint8Array`\<`ArrayBufferLike`\>

RLP-decode a byte payload, optionally returning unconsumed trailing bytes.

##### Parameters

###### input

[`Input`](../type-aliases/Input.md)

###### stream?

`false`

When true, return a [Decoded](../interfaces/Decoded.md) object instead of throwing on trailing data

##### Returns

[`NestedUint8Array`](../type-aliases/NestedUint8Array.md) \| `Uint8Array`\<`ArrayBufferLike`\>

##### Throws

If non-stream decoding leaves a non-empty remainder

##### See

https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/

#### Call Signature

> (`input`, `stream?`): [`Decoded`](../interfaces/Decoded.md)

decode helper.

##### Parameters

###### input

[`Input`](../type-aliases/Input.md)

###### stream?

`true`

##### Returns

[`Decoded`](../interfaces/Decoded.md)

### encode

> **encode**: (`input`) => `Uint8Array`

RLP-encode a scalar value or nested list.

#### Parameters

##### input

[`Input`](../type-aliases/Input.md)

#### Returns

`Uint8Array`

#### See

https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/
