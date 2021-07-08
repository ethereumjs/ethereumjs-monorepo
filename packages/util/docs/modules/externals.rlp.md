[ethereumjs-util](../README.md) / [externals](externals.md) / rlp

# Namespace: rlp

[externals](externals.md).rlp

[`rlp`](https://github.com/ethereumjs/rlp)

## Table of contents

### Interfaces

- [Decoded](../interfaces/externals.rlp.decoded.md)
- [List](../interfaces/externals.rlp.list.md)

### Type aliases

- [Input](externals.rlp.md#input)

### Functions

- [decode](externals.rlp.md#decode)
- [encode](externals.rlp.md#encode)
- [getLength](externals.rlp.md#getlength)

## Type aliases

### Input

Ƭ **Input**: `Buffer` \| `string` \| `number` \| `bigint` \| `Uint8Array` \| [BN](../classes/externals.bn-1.md) \| [List](../interfaces/externals.rlp.list.md) \| ``null``

#### Defined in

node_modules/rlp/dist/types.d.ts:3

## Functions

### decode

▸ **decode**(`input`, `stream?`): `Buffer`

RLP Decoding based on: [RLP](https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `Buffer` | will be converted to buffer |
| `stream?` | `boolean` | Is the input a stream (false by default) |

#### Returns

`Buffer`

- returns decode Array of Buffers containg the original message

#### Defined in

node_modules/rlp/dist/index.d.ts:17

▸ **decode**(`input`, `stream?`): `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Buffer`[] |
| `stream?` | `boolean` |

#### Returns

`Buffer`[]

#### Defined in

node_modules/rlp/dist/index.d.ts:18

▸ **decode**(`input`, `stream?`): `Buffer`[] \| `Buffer` \| [Decoded](../interfaces/externals.rlp.decoded.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [Input](externals.rlp.md#input) |
| `stream?` | `boolean` |

#### Returns

`Buffer`[] \| `Buffer` \| [Decoded](../interfaces/externals.rlp.decoded.md)

#### Defined in

node_modules/rlp/dist/index.d.ts:19

___

### encode

▸ **encode**(`input`): `Buffer`

RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
This function takes in a data, convert it to buffer if not, and a length for recursion

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [Input](externals.rlp.md#input) | will be converted to buffer |

#### Returns

`Buffer`

returns buffer of encoded data

#### Defined in

node_modules/rlp/dist/index.d.ts:10

___

### getLength

▸ **getLength**(`input`): `Buffer` \| `number`

Get the length of the RLP input

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [Input](externals.rlp.md#input) |

#### Returns

`Buffer` \| `number`

The length of the input or an empty Buffer if no input

#### Defined in

node_modules/rlp/dist/index.d.ts:25
