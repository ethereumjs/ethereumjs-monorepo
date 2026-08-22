[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / ExtensionMPTNode

# Class: ExtensionMPTNode

Defined in: [node/extension.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extension.ts#L6)

Extension MPT node: shared path prefix pointing to a child.

## Extends

- `ExtensionOrLeafMPTNodeBase`

## Constructors

### Constructor

> **new ExtensionMPTNode**(`nibbles`, `value`): `ExtensionMPTNode`

Defined in: [node/extension.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extension.ts#L7)

#### Parameters

##### nibbles

[`Nibbles`](../type-aliases/Nibbles.md)

##### value

`Uint8Array`

#### Returns

`ExtensionMPTNode`

#### Overrides

`ExtensionOrLeafMPTNodeBase.constructor`

## Properties

### \_isLeaf

> **\_isLeaf**: `boolean`

Defined in: [node/extensionOrLeafNodeBase.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L12)

#### Inherited from

`ExtensionOrLeafMPTNodeBase._isLeaf`

***

### \_nibbles

> **\_nibbles**: [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [node/extensionOrLeafNodeBase.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L10)

#### Inherited from

`ExtensionOrLeafMPTNodeBase._nibbles`

***

### \_value

> **\_value**: `Uint8Array`

Defined in: [node/extensionOrLeafNodeBase.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L11)

#### Inherited from

`ExtensionOrLeafMPTNodeBase._value`

## Methods

### encodedKey()

> **encodedKey**(): [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [node/extensionOrLeafNodeBase.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L24)

#### Returns

[`Nibbles`](../type-aliases/Nibbles.md)

#### Inherited from

`ExtensionOrLeafMPTNodeBase.encodedKey`

***

### key()

> **key**(`k?`): [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [node/extensionOrLeafNodeBase.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L28)

#### Parameters

##### k?

[`Nibbles`](../type-aliases/Nibbles.md)

#### Returns

[`Nibbles`](../type-aliases/Nibbles.md)

#### Inherited from

`ExtensionOrLeafMPTNodeBase.key`

***

### keyLength()

> **keyLength**(): `number`

Defined in: [node/extensionOrLeafNodeBase.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L36)

#### Returns

`number`

#### Inherited from

`ExtensionOrLeafMPTNodeBase.keyLength`

***

### raw()

> **raw**(): [`RawExtensionMPTNode`](../type-aliases/RawExtensionMPTNode.md)

Defined in: [node/extension.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extension.ts#L11)

#### Returns

[`RawExtensionMPTNode`](../type-aliases/RawExtensionMPTNode.md)

#### Overrides

`ExtensionOrLeafMPTNodeBase.raw`

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [node/extensionOrLeafNodeBase.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L52)

#### Returns

`Uint8Array`

#### Inherited from

`ExtensionOrLeafMPTNodeBase.serialize`

***

### value()

> **value**(`v?`): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [node/extensionOrLeafNodeBase.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L40)

#### Parameters

##### v?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

#### Inherited from

`ExtensionOrLeafMPTNodeBase.value`

***

### decodeKey()

> `static` **decodeKey**(`key`): [`Nibbles`](../type-aliases/Nibbles.md)

Defined in: [node/extensionOrLeafNodeBase.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/node/extensionOrLeafNodeBase.ts#L20)

#### Parameters

##### key

[`Nibbles`](../type-aliases/Nibbles.md)

#### Returns

[`Nibbles`](../type-aliases/Nibbles.md)

#### Inherited from

`ExtensionOrLeafMPTNodeBase.decodeKey`
