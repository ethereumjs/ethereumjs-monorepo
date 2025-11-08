[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / E2HSTypes

# Variable: E2HSTypes

> `const` **E2HSTypes**: `object`

Defined in: [packages/e2store/src/types.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/types.ts#L66)

E2HS Type Identifiers
Version                     = { type: [0x65, 0x32], data: nil }
CompressedHeaderWithProof   = { type: [0x03, 0x01], data: snappyFramed(ssz(header_with_proof)) }
CompressedBody              = { type: [0x04, 0x00], data: snappyFramed(rlp(body)) }
CompressedReceipts          = { type: [0x05, 0x00], data: snappyFramed(rlp(receipts)) }
BlockIndex                  = { type: [0x66, 0x32], data: block-index }

## Type Declaration

### BlockIndex

> `readonly` **BlockIndex**: `Uint8Array`\<`ArrayBuffer`\>

### CompressedBody

> `readonly` **CompressedBody**: `Uint8Array`\<`ArrayBuffer`\>

### CompressedHeaderWithProof

> `readonly` **CompressedHeaderWithProof**: `Uint8Array`\<`ArrayBuffer`\>

### CompressedReceipts

> `readonly` **CompressedReceipts**: `Uint8Array`\<`ArrayBuffer`\>

### Version

> `readonly` **Version**: `Uint8Array`\<`ArrayBuffer`\>
