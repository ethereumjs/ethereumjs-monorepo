[ethereumjs-util](../README.md) › ["account"](_account_.md)

# Module: "account"

## Index

### Variables

* [publicToAddress](_account_.md#const-publictoaddress)

### Functions

* [generateAddress](_account_.md#const-generateaddress)
* [generateAddress2](_account_.md#const-generateaddress2)
* [importPublic](_account_.md#const-importpublic)
* [isPrecompiled](_account_.md#const-isprecompiled)
* [isValidAddress](_account_.md#const-isvalidaddress)
* [isValidChecksumAddress](_account_.md#const-isvalidchecksumaddress)
* [isValidPrivate](_account_.md#const-isvalidprivate)
* [isValidPublic](_account_.md#const-isvalidpublic)
* [isZeroAddress](_account_.md#const-iszeroaddress)
* [privateToAddress](_account_.md#const-privatetoaddress)
* [privateToPublic](_account_.md#const-privatetopublic)
* [pubToAddress](_account_.md#const-pubtoaddress)
* [toChecksumAddress](_account_.md#const-tochecksumaddress)
* [zeroAddress](_account_.md#const-zeroaddress)

## Variables

### `Const` publicToAddress

• **publicToAddress**: *pubToAddress* = pubToAddress

*Defined in [account.ts:163](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L163)*

## Functions

### `Const` generateAddress

▸ **generateAddress**(`from`: Buffer, `nonce`: Buffer): *Buffer*

*Defined in [account.ts:75](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L75)*

Generates an address of a newly created contract.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | Buffer | The address which is creating this new address |
`nonce` | Buffer | The nonce of the from account  |

**Returns:** *Buffer*

___

### `Const` generateAddress2

▸ **generateAddress2**(`from`: Buffer | string, `salt`: Buffer | string, `initCode`: Buffer | string): *Buffer*

*Defined in [account.ts:95](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L95)*

Generates an address for a contract created using CREATE2.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | Buffer &#124; string | The address which is creating this new address |
`salt` | Buffer &#124; string | A salt |
`initCode` | Buffer &#124; string | The init code of the contract being created  |

**Returns:** *Buffer*

___

### `Const` importPublic

▸ **importPublic**(`publicKey`: Buffer): *Buffer*

*Defined in [account.ts:186](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L186)*

Converts a public key to the Ethereum format.

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | Buffer |

**Returns:** *Buffer*

___

### `Const` isPrecompiled

▸ **isPrecompiled**(`address`: Buffer | string): *boolean*

*Defined in [account.ts:117](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L117)*

Returns true if the supplied address belongs to a precompiled account (Byzantium).

**Parameters:**

Name | Type |
------ | ------ |
`address` | Buffer &#124; string |

**Returns:** *boolean*

___

### `Const` isValidAddress

▸ **isValidAddress**(`address`: string): *boolean*

*Defined in [account.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L20)*

Checks if the address is a valid. Accepts checksummed addresses too.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *boolean*

___

### `Const` isValidChecksumAddress

▸ **isValidChecksumAddress**(`address`: string, `eip1191ChainId?`: undefined | number): *boolean*

*Defined in [account.ts:66](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L66)*

Checks if the address is a valid checksummed address.

See toChecksumAddress' documentation for details about the eip1191ChainId parameter.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`eip1191ChainId?` | undefined &#124; number |

**Returns:** *boolean*

___

### `Const` isValidPrivate

▸ **isValidPrivate**(`privateKey`: Buffer): *boolean*

*Defined in [account.ts:125](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L125)*

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *boolean*

___

### `Const` isValidPublic

▸ **isValidPublic**(`publicKey`: Buffer, `sanitize`: boolean): *boolean*

*Defined in [account.ts:135](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L135)*

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`publicKey` | Buffer | - | The two points of an uncompressed key, unless sanitize is enabled |
`sanitize` | boolean | false | Accept public keys in other formats  |

**Returns:** *boolean*

___

### `Const` isZeroAddress

▸ **isZeroAddress**(`address`: string): *boolean*

*Defined in [account.ts:27](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L27)*

Checks if a given address is a zero address.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *boolean*

___

### `Const` privateToAddress

▸ **privateToAddress**(`privateKey`: Buffer): *Buffer*

*Defined in [account.ts:169](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L169)*

Returns the ethereum address of a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | A private key must be 256 bits wide  |

**Returns:** *Buffer*

___

### `Const` privateToPublic

▸ **privateToPublic**(`privateKey`: Buffer): *Buffer*

*Defined in [account.ts:177](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L177)*

Returns the ethereum public key of a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | A private key must be 256 bits wide  |

**Returns:** *Buffer*

___

### `Const` pubToAddress

▸ **pubToAddress**(`pubKey`: Buffer, `sanitize`: boolean): *Buffer*

*Defined in [account.ts:154](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L154)*

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`pubKey` | Buffer | - | The two points of an uncompressed key, unless sanitize is enabled |
`sanitize` | boolean | false | Accept public keys in other formats  |

**Returns:** *Buffer*

___

### `Const` toChecksumAddress

▸ **toChecksumAddress**(`address`: string, `eip1191ChainId?`: undefined | number): *string*

*Defined in [account.ts:42](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L42)*

Returns a checksummed address.

If a eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details, consult EIP-1191.

WARNING: Checksums with and without the chainId will differ. As of 2019-06-26, the most commonly
used variation in Ethereum was without the chainId. This may change in the future.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`eip1191ChainId?` | undefined &#124; number |

**Returns:** *string*

___

### `Const` zeroAddress

▸ **zeroAddress**(): *string*

*Defined in [account.ts:11](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L11)*

Returns a zero address.

**Returns:** *string*
