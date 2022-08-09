[@ethereumjs/trie](../README.md) / ExtensionNode

# Class: ExtensionNode

## Table of contents

### Constructors

- [constructor](ExtensionNode.md#constructor)

### Properties

- [\_nibbles](ExtensionNode.md#_nibbles)
- [\_value](ExtensionNode.md#_value)

### Accessors

- [key](ExtensionNode.md#key)
- [keyLength](ExtensionNode.md#keylength)
- [value](ExtensionNode.md#value)

### Methods

- [encodedKey](ExtensionNode.md#encodedkey)
- [raw](ExtensionNode.md#raw)
- [serialize](ExtensionNode.md#serialize)
- [decodeKey](ExtensionNode.md#decodekey)
- [encodeKey](ExtensionNode.md#encodekey)

## Constructors

### constructor

• **new ExtensionNode**(`nibbles`, `value`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `nibbles` | [`Nibbles`](../README.md#nibbles) |
| `value` | `Buffer` |

#### Defined in

[packages/trie/src/trie/node/extension.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L12)

## Properties

### \_nibbles

• **\_nibbles**: [`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L9)

___

### \_value

• **\_value**: `Buffer`

#### Defined in

[packages/trie/src/trie/node/extension.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L10)

## Accessors

### key

• `get` **key**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L25)

• `set` **key**(`k`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | [`Nibbles`](../README.md#nibbles) |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/extension.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L29)

___

### keyLength

• `get` **keyLength**(): `number`

#### Returns

`number`

#### Defined in

[packages/trie/src/trie/node/extension.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L33)

___

### value

• `get` **value**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/extension.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L37)

• `set` **value**(`v`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `Buffer` |

#### Returns

`void`

#### Defined in

[packages/trie/src/trie/node/extension.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L41)

## Methods

### encodedKey

▸ **encodedKey**(): [`Nibbles`](../README.md#nibbles)

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L45)

___

### raw

▸ **raw**(): [`Buffer`, `Buffer`]

#### Returns

[`Buffer`, `Buffer`]

#### Defined in

[packages/trie/src/trie/node/extension.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L49)

___

### serialize

▸ **serialize**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/trie/src/trie/node/extension.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L53)

___

### decodeKey

▸ `Static` **decodeKey**(`key`): [`Nibbles`](../README.md#nibbles)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Nibbles`](../README.md#nibbles) |

#### Returns

[`Nibbles`](../README.md#nibbles)

#### Defined in

[packages/trie/src/trie/node/extension.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L21)

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

[packages/trie/src/trie/node/extension.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/trie/node/extension.ts#L17)
