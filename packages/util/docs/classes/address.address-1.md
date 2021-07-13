[ethereumjs-util](../README.md) / [address](../modules/address.md) / Address

# Class: Address

[address](../modules/address.md).Address

## Table of contents

### Constructors

- [constructor](address.address-1.md#constructor)

### Properties

- [buf](address.address-1.md#buf)

### Methods

- [equals](address.address-1.md#equals)
- [isPrecompileOrSystemAddress](address.address-1.md#isprecompileorsystemaddress)
- [isZero](address.address-1.md#iszero)
- [toBuffer](address.address-1.md#tobuffer)
- [toString](address.address-1.md#tostring)
- [fromPrivateKey](address.address-1.md#fromprivatekey)
- [fromPublicKey](address.address-1.md#frompublickey)
- [fromString](address.address-1.md#fromstring)
- [generate](address.address-1.md#generate)
- [generate2](address.address-1.md#generate2)
- [zero](address.address-1.md#zero)

## Constructors

### constructor

• **new Address**(`buf`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `Buffer` |

#### Defined in

[packages/util/src/address.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L13)

## Properties

### buf

• `Readonly` **buf**: `Buffer`

#### Defined in

[packages/util/src/address.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L13)

## Methods

### equals

▸ **equals**(`address`): `boolean`

Is address equal to another.

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [Address](address.address-1.md) |

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L81)

___

### isPrecompileOrSystemAddress

▸ **isPrecompileOrSystemAddress**(): `boolean`

True if address is in the address range defined
by EIP-1352

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L96)

___

### isZero

▸ **isZero**(): `boolean`

Is address zero.

#### Returns

`boolean`

#### Defined in

[packages/util/src/address.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L88)

___

### toBuffer

▸ **toBuffer**(): `Buffer`

Returns Buffer representation of address.

#### Returns

`Buffer`

#### Defined in

[packages/util/src/address.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L114)

___

### toString

▸ **toString**(): `string`

Returns hex encoding of address.

#### Returns

`string`

#### Defined in

[packages/util/src/address.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L107)

___

### fromPrivateKey

▸ `Static` **fromPrivateKey**(`privateKey`): [Address](address.address-1.md)

Returns an address for a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

[Address](address.address-1.md)

#### Defined in

[packages/util/src/address.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L50)

___

### fromPublicKey

▸ `Static` **fromPublicKey**(`pubKey`): [Address](address.address-1.md)

Returns an address for a given public key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pubKey` | `Buffer` | The two points of an uncompressed key |

#### Returns

[Address](address.address-1.md)

#### Defined in

[packages/util/src/address.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L40)

___

### fromString

▸ `Static` **fromString**(`str`): [Address](address.address-1.md)

Returns an Address object from a hex-encoded string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | Hex-encoded address |

#### Returns

[Address](address.address-1.md)

#### Defined in

[packages/util/src/address.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L31)

___

### generate

▸ `Static` **generate**(`from`, `nonce`): [Address](address.address-1.md)

Generates an address for a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [Address](address.address-1.md) | The address which is creating this new address |
| `nonce` | [BN](externals.bn-1.md) | The nonce of the from account |

#### Returns

[Address](address.address-1.md)

#### Defined in

[packages/util/src/address.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L61)

___

### generate2

▸ `Static` **generate2**(`from`, `salt`, `initCode`): [Address](address.address-1.md)

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | [Address](address.address-1.md) | The address which is creating this new address |
| `salt` | `Buffer` | A salt |
| `initCode` | `Buffer` | The init code of the contract being created |

#### Returns

[Address](address.address-1.md)

#### Defined in

[packages/util/src/address.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L72)

___

### zero

▸ `Static` **zero**(): [Address](address.address-1.md)

Returns the zero address.

#### Returns

[Address](address.address-1.md)

#### Defined in

[packages/util/src/address.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L23)
