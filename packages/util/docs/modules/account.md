[ethereumjs-util](../README.md) / account

# Module: account

## Table of contents

### Classes

- [Account](../classes/account.account-1.md)

### Interfaces

- [AccountData](../interfaces/account.accountdata.md)

### Functions

- [generateAddress](account.md#generateaddress)
- [generateAddress2](account.md#generateaddress2)
- [importPublic](account.md#importpublic)
- [isValidAddress](account.md#isvalidaddress)
- [isValidChecksumAddress](account.md#isvalidchecksumaddress)
- [isValidPrivate](account.md#isvalidprivate)
- [isValidPublic](account.md#isvalidpublic)
- [isZeroAddress](account.md#iszeroaddress)
- [privateToAddress](account.md#privatetoaddress)
- [privateToPublic](account.md#privatetopublic)
- [pubToAddress](account.md#pubtoaddress)
- [publicToAddress](account.md#publictoaddress)
- [toChecksumAddress](account.md#tochecksumaddress)
- [zeroAddress](account.md#zeroaddress)

## Functions

### generateAddress

▸ `Const` **generateAddress**(`from`, `nonce`): `Buffer`

Generates an address of a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `Buffer` | The address which is creating this new address |
| `nonce` | `Buffer` | The nonce of the from account |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L190)

___

### generateAddress2

▸ `Const` **generateAddress2**(`from`, `salt`, `initCode`): `Buffer`

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `Buffer` | The address which is creating this new address |
| `salt` | `Buffer` | A salt |
| `initCode` | `Buffer` | The init code of the contract being created |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L211)

___

### importPublic

▸ `Const` **importPublic**(`publicKey`): `Buffer`

Converts a public key to the Ethereum format.

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L291)

___

### isValidAddress

▸ `Const` **isValidAddress**(`hexAddress`): `boolean`

Checks if the address is a valid. Accepts checksummed addresses too.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L129)

___

### isValidChecksumAddress

▸ `Const` **isValidChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `boolean`

Checks if the address is a valid checksummed address.

See toChecksumAddress' documentation for details about the eip1191ChainId parameter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |
| `eip1191ChainId?` | `string` \| `number` \| `Buffer` \| [BN](../classes/externals.bn-1.md) |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L178)

___

### isValidPrivate

▸ `Const` **isValidPrivate**(`privateKey`): `boolean`

Checks if the private key satisfies the rules of the curve secp256k1.

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L229)

___

### isValidPublic

▸ `Const` **isValidPublic**(`publicKey`, `sanitize?`): `boolean`

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `publicKey` | `Buffer` | `undefined` | The two points of an uncompressed key, unless sanitize is enabled |
| `sanitize` | `boolean` | false | Accept public keys in other formats |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:239](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L239)

___

### isZeroAddress

▸ `Const` **isZeroAddress**(`hexAddress`): `boolean`

Checks if a given address is the zero address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L311)

___

### privateToAddress

▸ `Const` **privateToAddress**(`privateKey`): `Buffer`

Returns the ethereum address of a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L284)

___

### privateToPublic

▸ `Const` **privateToPublic**(`privateKey`): `Buffer`

Returns the ethereum public key of a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:274](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L274)

___

### pubToAddress

▸ `Const` **pubToAddress**(`pubKey`, `sanitize?`): `Buffer`

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pubKey` | `Buffer` | `undefined` | The two points of an uncompressed key, unless sanitize is enabled |
| `sanitize` | `boolean` | false | Accept public keys in other formats |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L259)

___

### publicToAddress

▸ `Const` **publicToAddress**(`pubKey`, `sanitize?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pubKey` | `Buffer` | `undefined` |
| `sanitize` | `boolean` | false |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L268)

___

### toChecksumAddress

▸ `Const` **toChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `string`

Returns a checksummed address.

If a eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details see [EIP-1191](https://eips.ethereum.org/EIPS/eip-1191).

WARNING: Checksums with and without the chainId will differ. As of 2019-06-26, the most commonly
used variation in Ethereum was without the chainId. This may change in the future.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |
| `eip1191ChainId?` | `string` \| `number` \| `Buffer` \| [BN](../classes/externals.bn-1.md) |

#### Returns

`string`

#### Defined in

[packages/util/src/account.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L149)

___

### zeroAddress

▸ `Const` **zeroAddress**(): `string`

Returns the zero address.

#### Returns

`string`

#### Defined in

[packages/util/src/account.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L302)
