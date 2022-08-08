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

[packages/trie/src/trie/node/leaf.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L12)

## Properties

### \_nibbles

• **\_nibbles**: [`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L9)

___

### \_value

• **\_value**: `Buffer`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L10)

## Accessors

### key

• `get` **key**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L25)

• `set` **key**(`k`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | [`Nibbles`](../README.md#nibbles) |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L29)

___

### keyLength

• `get` **keyLength**(): `number`

#### Returns

`number`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L33)

___

### value

• `get` **value**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L37)

• `set` **value**(`v`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L41)

## Methods

### encodedKey

▸ **encodedKey**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/leaf.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L45)

___

### raw

▸ **raw**(): [`Buffer`, `Buffer`]

#### Returns

[`Buffer`, `Buffer`]

#### Defined in

[packages/trie/src/trie/node/leaf.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L49)

___

### serialize

▸ **serialize**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/leaf.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L53)

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

[packages/trie/src/trie/node/leaf.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L21)

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

[packages/trie/src/trie/node/leaf.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/leaf.ts#L17)
