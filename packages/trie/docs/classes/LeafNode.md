[@ethereumjs/trie](../README.md) / LeafNode

# Class: LeafNode

## Table of contents

### Constructors

- [constructor](LeafNode.md#constructor)

### Properties

- [\_nibbles](LeafNode.md#_nibbles)
- [\_value](LeafNode.md#_value)

### Accessors

- [key](LeafNode.md#key)
- [keyLength](LeafNode.md#keylength)
- [value](LeafNode.md#value)

### Methods

- [encodedKey](LeafNode.md#encodedkey)
- [raw](LeafNode.md#raw)
- [serialize](LeafNode.md#serialize)
- [decodeKey](LeafNode.md#decodekey)
- [encodeKey](LeafNode.md#encodekey)

## Constructors

### constructor

• **new LeafNode**(`nibbles`, `value`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `nibbles` | [`Nibbles`](../README.md#nibbles) |
| `value` | `Buffer` |

#### Defined in

[packages/trie/src/trie/node/leaf.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L13)

## Properties

### \_nibbles

• **\_nibbles**: [`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L10)

___

### \_value

• **\_value**: `Buffer`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L11)

## Accessors

### key

• `get` **key**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L26)

• `set` **key**(`k`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | [`Nibbles`](../README.md#nibbles) |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L30)

___

### keyLength

• `get` **keyLength**(): `number`

#### Returns

`number`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L34)

___

### value

• `get` **value**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L38)

• `set` **value**(`v`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L42)

## Methods

### encodedKey

▸ **encodedKey**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L46)

___

### raw

▸ **raw**(): [`Buffer`, `Buffer`]

#### Returns

[`Buffer`, `Buffer`]

#### Defined in

[packages/trie/src/trie/node/leaf.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L50)

___

### serialize

▸ **serialize**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L54)

___

### decodeKey

▸ `Static` **decodeKey**(`encodedKey`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `encodedKey` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L22)

___

### encodeKey

▸ `Static` **encodeKey**(`key`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L18)
