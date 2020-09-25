[ethereumjs-util](../README.md) › ["account"](_account_.md)

# Module: "account"

## Index

### Classes

* [Account](../classes/_account_.account.md)

### Interfaces

* [AccountData](../interfaces/_account_.accountdata.md)

### Variables

* [publicToAddress](_account_.md#const-publictoaddress)

### Functions

* [generateAddress](_account_.md#const-generateaddress)
* [generateAddress2](_account_.md#const-generateaddress2)
* [importPublic](_account_.md#const-importpublic)
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

*Defined in [account.ts:257](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L257)*

## Functions

### `Const` generateAddress

▸ **generateAddress**(`from`: Buffer, `nonce`: Buffer): *Buffer*

*Defined in [account.ts:179](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L179)*

Generates an address of a newly created contract.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | Buffer | The address which is creating this new address |
`nonce` | Buffer | The nonce of the from account  |

**Returns:** *Buffer*

___

### `Const` generateAddress2

▸ **generateAddress2**(`from`: Buffer, `salt`: Buffer, `initCode`: Buffer): *Buffer*

*Defined in [account.ts:200](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L200)*

Generates an address for a contract created using CREATE2.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | Buffer | The address which is creating this new address |
`salt` | Buffer | A salt |
`initCode` | Buffer | The init code of the contract being created  |

**Returns:** *Buffer*

___

### `Const` importPublic

▸ **importPublic**(`publicKey`: Buffer): *Buffer*

*Defined in [account.ts:280](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L280)*

Converts a public key to the Ethereum format.

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | Buffer |

**Returns:** *Buffer*

___

### `Const` isValidAddress

▸ **isValidAddress**(`hexAddress`: string): *boolean*

*Defined in [account.ts:127](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L127)*

Checks if the address is a valid. Accepts checksummed addresses too.

**Parameters:**

Name | Type |
------ | ------ |
`hexAddress` | string |

**Returns:** *boolean*

___

### `Const` isValidChecksumAddress

▸ **isValidChecksumAddress**(`hexAddress`: string, `eip1191ChainId?`: undefined | number): *boolean*

*Defined in [account.ts:167](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L167)*

Checks if the address is a valid checksummed address.

See toChecksumAddress' documentation for details about the eip1191ChainId parameter.

**Parameters:**

Name | Type |
------ | ------ |
`hexAddress` | string |
`eip1191ChainId?` | undefined &#124; number |

**Returns:** *boolean*

___

### `Const` isValidPrivate

▸ **isValidPrivate**(`privateKey`: Buffer): *boolean*

*Defined in [account.ts:218](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L218)*

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | Buffer |

**Returns:** *boolean*

___

### `Const` isValidPublic

▸ **isValidPublic**(`publicKey`: Buffer, `sanitize`: boolean): *boolean*

*Defined in [account.ts:228](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L228)*

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

▸ **isZeroAddress**(`hexAddress`: string): *boolean*

*Defined in [account.ts:300](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L300)*

Checks if a given address is a zero address.

**Parameters:**

Name | Type |
------ | ------ |
`hexAddress` | string |

**Returns:** *boolean*

___

### `Const` privateToAddress

▸ **privateToAddress**(`privateKey`: Buffer): *Buffer*

*Defined in [account.ts:263](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L263)*

Returns the ethereum address of a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | A private key must be 256 bits wide  |

**Returns:** *Buffer*

___

### `Const` privateToPublic

▸ **privateToPublic**(`privateKey`: Buffer): *Buffer*

*Defined in [account.ts:271](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L271)*

Returns the ethereum public key of a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | Buffer | A private key must be 256 bits wide  |

**Returns:** *Buffer*

___

### `Const` pubToAddress

▸ **pubToAddress**(`pubKey`: Buffer, `sanitize`: boolean): *Buffer*

*Defined in [account.ts:248](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L248)*

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

▸ **toChecksumAddress**(`hexAddress`: string, `eip1191ChainId?`: undefined | number): *string*

*Defined in [account.ts:142](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L142)*

Returns a checksummed address.

If a eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details, consult EIP-1191.

WARNING: Checksums with and without the chainId will differ. As of 2019-06-26, the most commonly
used variation in Ethereum was without the chainId. This may change in the future.

**Parameters:**

Name | Type |
------ | ------ |
`hexAddress` | string |
`eip1191ChainId?` | undefined &#124; number |

**Returns:** *string*

___

### `Const` zeroAddress

▸ **zeroAddress**(): *string*

*Defined in [account.ts:291](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L291)*

Returns a zero address.

**Returns:** *string*
