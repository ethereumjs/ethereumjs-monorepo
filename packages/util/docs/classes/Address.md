[@ethereumjs/util](../README.md) / Address

# Class: Address

Handling and generating Ethereum addresses

## Table of contents

### Constructors

- [constructor](Address.md#constructor)

### Properties

- [buf](Address.md#buf)

### Methods

- [equals](Address.md#equals)
- [isPrecompileOrSystemAddress](Address.md#isprecompileorsystemaddress)
- [isZero](Address.md#iszero)
- [toBuffer](Address.md#tobuffer)
- [toString](Address.md#tostring)
- [fromPrivateKey](Address.md#fromprivatekey)
- [fromPublicKey](Address.md#frompublickey)
- [fromString](Address.md#fromstring)
- [generate](Address.md#generate)
- [generate2](Address.md#generate2)
- [zero](Address.md#zero)

## Constructors

### constructor

• **new Address**(`buf`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `Buffer` |

#### Defined in

[packages/util/src/address.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L16)

## Properties

### buf

• `Readonly` **buf**: `Buffer`

#### Defined in

[packages/util/src/address.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L14)

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

[packages/util/src/address.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L96)

___

### isPrecompileOrSystemAddress

▸ **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L111)

___

### isZero

▸ **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L103)

___

### toBuffer

▸ **toBuffer**(): `Buffer`

Returns Buffer representation of address.

#### Returns

`Buffer`

#### Defined in

[packages/util/src/address.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L128)

___

### toString

▸ **toString**(): `string`

Returns hex encoding of address.

#### Returns

`string`

#### Defined in

[packages/util/src/address.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L121)

___

### fromPrivateKey

▸ `Static` **fromPrivateKey**(`privateKey`): [`Address`](Address.md)

Returns an address for a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L57)

___

### fromPublicKey

▸ `Static` **fromPublicKey**(`pubKey`): [`Address`](Address.md)

Returns an address for a given public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pubKey` | `Buffer` | The two points of an uncompressed key |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L45)

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

[packages/util/src/address.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L34)

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

[packages/util/src/address.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L70)

___

### generate2

▸ `Static` **generate2**(`from`, `salt`, `initCode`): [`Address`](Address.md)

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [`Address`](Address.md) | The address which is creating this new address |
| `salt` | `Buffer` | A salt |
| `initCode` | `Buffer` | The init code of the contract being created |

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L83)

___

### zero

▸ `Static` **zero**(): [`Address`](Address.md)

Returns the zero address.

#### Returns

[`Address`](Address.md)

#### Defined in

[packages/util/src/address.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L26)
