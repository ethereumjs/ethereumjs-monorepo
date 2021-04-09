[ethereumjs-util](../README.md) › ["address"](../modules/_address_.md) › [Address](_address_.address.md)

# Class: Address

## Hierarchy

* **Address**

## Index

### Constructors

* [constructor](_address_.address.md#constructor)

### Properties

* [buf](_address_.address.md#buf)

### Methods

* [equals](_address_.address.md#equals)
* [isPrecompileOrSystemAddress](_address_.address.md#isprecompileorsystemaddress)
* [isZero](_address_.address.md#iszero)
* [toBuffer](_address_.address.md#tobuffer)
* [toString](_address_.address.md#tostring)
* [fromPrivateKey](_address_.address.md#static-fromprivatekey)
* [fromPublicKey](_address_.address.md#static-frompublickey)
* [fromString](_address_.address.md#static-fromstring)
* [generate](_address_.address.md#static-generate)
* [generate2](_address_.address.md#static-generate2)
* [zero](_address_.address.md#static-zero)

## Constructors

###  constructor

\+ **new Address**(`buf`: Buffer): *[Address](_address_.address.md)*

*Defined in [address.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`buf` | Buffer |

**Returns:** *[Address](_address_.address.md)*

## Properties

###  buf

• **buf**: *Buffer*

*Defined in [address.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L13)*

## Methods

###  equals

▸ **equals**(`address`: [Address](_address_.address.md)): *boolean*

*Defined in [address.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L81)*

Is address equal to another.

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](_address_.address.md) |

**Returns:** *boolean*

___

###  isPrecompileOrSystemAddress

▸ **isPrecompileOrSystemAddress**(): *boolean*

*Defined in [address.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L96)*

True if address is in the address range defined
by EIP-1352

**Returns:** *boolean*

___

###  isZero

▸ **isZero**(): *boolean*

*Defined in [address.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L88)*

Is address zero.

**Returns:** *boolean*

___

###  toBuffer

▸ **toBuffer**(): *Buffer*

*Defined in [address.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L114)*

Returns Buffer representation of address.

**Returns:** *Buffer*

___

###  toString

▸ **toString**(): *string*

*Defined in [address.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L107)*

Returns hex encoding of address.

**Returns:** *string*

___

### `Static` fromPrivateKey

▸ **fromPrivateKey**(`privateKey`: Buffer): *[Address](_address_.address.md)*

*Defined in [address.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L50)*

Returns an address for a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | A private key must be 256 bits wide  |

**Returns:** *[Address](_address_.address.md)*

___

### `Static` fromPublicKey

▸ **fromPublicKey**(`pubKey`: Buffer): *[Address](_address_.address.md)*

*Defined in [address.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L40)*

Returns an address for a given public key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pubKey` | Buffer | The two points of an uncompressed key  |

**Returns:** *[Address](_address_.address.md)*

___

### `Static` fromString

▸ **fromString**(`str`: string): *[Address](_address_.address.md)*

*Defined in [address.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L31)*

Returns an Address object from a hex-encoded string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | Hex-encoded address  |

**Returns:** *[Address](_address_.address.md)*

___

### `Static` generate

▸ **generate**(`from`: [Address](_address_.address.md), `nonce`: BN): *[Address](_address_.address.md)*

*Defined in [address.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L61)*

Generates an address for a newly created contract.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | [Address](_address_.address.md) | The address which is creating this new address |
`nonce` | BN | The nonce of the from account  |

**Returns:** *[Address](_address_.address.md)*

___

### `Static` generate2

▸ **generate2**(`from`: [Address](_address_.address.md), `salt`: Buffer, `initCode`: Buffer): *[Address](_address_.address.md)*

*Defined in [address.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L72)*

Generates an address for a contract created using CREATE2.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | [Address](_address_.address.md) | The address which is creating this new address |
`salt` | Buffer | A salt |
`initCode` | Buffer | The init code of the contract being created  |

**Returns:** *[Address](_address_.address.md)*

___

### `Static` zero

▸ **zero**(): *[Address](_address_.address.md)*

*Defined in [address.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/address.ts#L23)*

Returns the zero address.

**Returns:** *[Address](_address_.address.md)*
