[@ethereumjs/util](../README.md) / Address

# Class: Address

Handling and generating Ethereum addresses

## Table of contents

### Constructors

- [constructor](Address.md#constructor)

### Properties

- [bytes](Address.md#bytes)

### Methods

- [equals](Address.md#equals)
- [isPrecompileOrSystemAddress](Address.md#isprecompileorsystemaddress)
- [isZero](Address.md#iszero)
- [toBytes](Address.md#tobytes)
- [toString](Address.md#tostring)
- [fromPrivateKey](Address.md#fromprivatekey)
- [fromPublicKey](Address.md#frompublickey)
- [fromString](Address.md#fromstring)
- [generate](Address.md#generate)
- [generate2](Address.md#generate2)
- [zero](Address.md#zero)

## Constructors

### constructor

• **new Address**(`bytes`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Defined in

[packages/util/src/address.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L17)

## Properties

### bytes

• `Readonly` **bytes**: `Uint8Array`

#### Defined in

[packages/util/src/address.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L15)

## Methods

### equals

▸ **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](Address.md) |

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L97)

___

### isPrecompileOrSystemAddress

▸ **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L112)

___

### isZero

▸ **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L104)

___

### toBytes

▸ **toBytes**(): `Uint8Array`

Returns a new Uint8Array representation of address.

#### Returns

`Uint8Array`

#### Defined in

[packages/util/src/address.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L129)

___

### toString

▸ **toString**(): `string`

Returns hex encoding of address.

#### Returns

`string`

#### Defined in

[packages/util/src/address.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L122)

___

### fromPrivateKey

▸ `Static` **fromPrivateKey**(`privateKey`): [`Address`](Address.md)

Returns an address for a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Uint8Array` | A private key must be 256 bits wide |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L58)

___

### fromPublicKey

▸ `Static` **fromPublicKey**(`pubKey`): [`Address`](Address.md)

Returns an address for a given public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pubKey` | `Uint8Array` | The two points of an uncompressed key |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L46)

___

### fromString

▸ `Static` **fromString**(`str`): [`Address`](Address.md)

Returns an Address object from a hex-encoded string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | Hex-encoded address |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L35)

___

### generate

▸ `Static` **generate**(`from`, `nonce`): [`Address`](Address.md)

Generates an address for a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`Address`](Address.md) | The address which is creating this new address |
| `nonce` | `bigint` | The nonce of the from account |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L71)

___

### generate2

▸ `Static` **generate2**(`from`, `salt`, `initCode`): [`Address`](Address.md)

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`Address`](Address.md) | The address which is creating this new address |
| `salt` | `Uint8Array` | A salt |
| `initCode` | `Uint8Array` | The init code of the contract being created |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L84)

___

### zero

▸ `Static` **zero**(): [`Address`](Address.md)

Returns the zero address.

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L27)
