[ethereumjs-util](../README.md) / rlp

# Namespace: rlp

[`rlp`](https://github.com/ethereumjs/rlp)

## Table of contents

### Interfaces

- [Decoded](../interfaces/rlp.Decoded.md)
- [List](../interfaces/rlp.List.md)

### Type Aliases

- [Input](rlp.md#input)

### Functions

- [decode](rlp.md#decode)
- [encode](rlp.md#encode)
- [getLength](rlp.md#getlength)

## Type Aliases

### Input

Ƭ **Input**: `Buffer` \| `string` \| `number` \| `bigint` \| `Uint8Array` \| [`BN`](../classes/BN.md) \| [`List`](../interfaces/rlp.List.md) \| ``null``

#### Defined in

packages/util/node_modules/rlp/dist/types.d.ts:3

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

packages/util/node_modules/rlp/dist/index.d.ts:17

▸ **decode**(`input`, `stream?`): `Buffer`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Buffer`[] |
| `stream?` | `boolean` |

#### Returns

`Buffer`[]

#### Defined in

packages/util/node_modules/rlp/dist/index.d.ts:18

▸ **decode**(`input`, `stream?`): `Buffer`[] \| `Buffer` \| [`Decoded`](../interfaces/rlp.Decoded.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Input`](rlp.md#input) |
| `stream?` | `boolean` |

#### Returns

`Buffer`[] \| `Buffer` \| [`Decoded`](../interfaces/rlp.Decoded.md)

#### Defined in

packages/util/node_modules/rlp/dist/index.d.ts:19

___

### encode

▸ **encode**(`input`): `Buffer`

RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
This function takes in a data, convert it to buffer if not, and a length for recursion

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`Input`](rlp.md#input) | will be converted to buffer |

#### Returns

`Buffer`

returns buffer of encoded data

#### Defined in

packages/util/node_modules/rlp/dist/index.d.ts:10

___

### getLength

▸ **getLength**(`input`): `Buffer` \| `number`

Get the length of the RLP input

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`Input`](rlp.md#input) |

#### Returns

`Buffer` \| `number`

The length of the input or an empty Buffer if no input

#### Defined in

packages/util/node_modules/rlp/dist/index.d.ts:25
