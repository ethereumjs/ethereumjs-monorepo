[@ethereumjs/wallet](../README.md) / Wallet

# Class: Wallet

## Table of contents

### Constructors

- [constructor](Wallet.md#constructor)

### Methods

- [getAddress](Wallet.md#getaddress)
- [getAddressString](Wallet.md#getaddressstring)
- [getChecksumAddressString](Wallet.md#getchecksumaddressstring)
- [getPrivateKey](Wallet.md#getprivatekey)
- [getPrivateKeyString](Wallet.md#getprivatekeystring)
- [getPublicKey](Wallet.md#getpublickey)
- [getPublicKeyString](Wallet.md#getpublickeystring)
- [getV3Filename](Wallet.md#getv3filename)
- [toV3](Wallet.md#tov3)
- [toV3String](Wallet.md#tov3string)
- [verifyPublicKey](Wallet.md#verifypublickey)
- [fromEthSale](Wallet.md#fromethsale)
- [fromExtendedPrivateKey](Wallet.md#fromextendedprivatekey)
- [fromExtendedPublicKey](Wallet.md#fromextendedpublickey)
- [fromPrivateKey](Wallet.md#fromprivatekey)
- [fromPublicKey](Wallet.md#frompublickey)
- [fromV1](Wallet.md#fromv1)
- [fromV3](Wallet.md#fromv3)
- [generate](Wallet.md#generate)
- [generateVanityAddress](Wallet.md#generatevanityaddress)

## Constructors

### constructor

• **new Wallet**(`privateKey?`, `publicKey?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `privateKey?` | `Uint8Array` | `undefined` |
| `publicKey` | `undefined` \| `Uint8Array` | `undefined` |

#### Defined in

[wallet.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L266)

## Methods

### getAddress

▸ **getAddress**(): `Uint8Array`

Returns the wallet's address.

#### Returns

`Uint8Array`

#### Defined in

[wallet.ts:548](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L548)

___

### getAddressString

▸ **getAddressString**(): `string`

Returns the wallet's address as a "0x" prefixed hex string

#### Returns

`string`

#### Defined in

[wallet.ts:555](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L555)

___

### getChecksumAddressString

▸ **getChecksumAddressString**(): `string`

Returns the wallet's private key as a "0x" prefixed hex string checksummed
according to [EIP 55](https://github.com/ethereum/EIPs/issues/55).

#### Returns

`string`

#### Defined in

[wallet.ts:563](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L563)

___

### getPrivateKey

▸ **getPrivateKey**(): `Uint8Array`

Returns the wallet's private key.

#### Returns

`Uint8Array`

#### Defined in

[wallet.ts:523](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L523)

___

### getPrivateKeyString

▸ **getPrivateKeyString**(): `string`

#### Returns

`string`

#### Defined in

[wallet.ts:527](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L527)

___

### getPublicKey

▸ **getPublicKey**(): `Uint8Array`

Returns the wallet's public key.

#### Returns

`Uint8Array`

#### Defined in

[wallet.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L534)

___

### getPublicKeyString

▸ **getPublicKeyString**(): `string`

Returns the wallet's public key as a "0x" prefixed hex string

#### Returns

`string`

#### Defined in

[wallet.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L541)

___

### getV3Filename

▸ **getV3Filename**(`timestamp?`): `string`

Return the suggested filename for V3 keystores.

#### Parameters

| Name | Type |
| :------ | :------ |
| `timestamp?` | `number` |

#### Returns

`string`

#### Defined in

[wallet.ts:633](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L633)

___

### toV3

▸ **toV3**(`password`, `opts?`): `Promise`<`V3Keystore`\>

Returns an Etherem Version 3 Keystore Format object representing the wallet

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | The password used to encrypt the Keystore. |
| `opts?` | `Partial`<`V3Params`\> | The options for the keystore. See [its spec](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition) for more info. |

#### Returns

`Promise`<`V3Keystore`\>

#### Defined in

[wallet.ts:573](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L573)

___

### toV3String

▸ **toV3String**(`password`, `opts?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `opts?` | `Partial`<`V3Params`\> |

#### Returns

`Promise`<`string`\>

#### Defined in

[wallet.ts:654](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L654)

___

### verifyPublicKey

▸ **verifyPublicKey**(`publicKey`): `boolean`

Verify the publicKey, privateKey pair

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Uint8Array` | the public key to verify against the private key of the wallet |

#### Returns

`boolean`

#### Defined in

[wallet.ts:663](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L663)

___

### fromEthSale

▸ `Static` **fromEthSale**(`input`, `password`): `Promise`<[`Wallet`](Wallet.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` \| `EthSaleKeystore` |
| `password` | `string` |

#### Returns

`Promise`<[`Wallet`](Wallet.md)\>

#### Defined in

[wallet.ts:465](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L465)

___

### fromExtendedPrivateKey

▸ `Static` **fromExtendedPrivateKey**(`extendedPrivateKey`): [`Wallet`](Wallet.md)

Create an instance based on a BIP32 extended private key (xprv)

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendedPrivateKey` | `string` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[wallet.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L357)

___

### fromExtendedPublicKey

▸ `Static` **fromExtendedPublicKey**(`extendedPublicKey`): [`Wallet`](Wallet.md)

Create an instance based on a BIP32 extended public key (xpub)

#### Parameters

| Name | Type |
| :------ | :------ |
| `extendedPublicKey` | `string` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[wallet.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L338)

___

### fromPrivateKey

▸ `Static` **fromPrivateKey**(`privateKey`): [`Wallet`](Wallet.md)

Create an instance based on a raw private key

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Uint8Array` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[wallet.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L350)

___

### fromPublicKey

▸ `Static` **fromPublicKey**(`publicKey`, `nonStrict?`): [`Wallet`](Wallet.md)

Create an instance based on a public key (certain methods will not be available)

This method only accepts uncompressed Ethereum-style public keys, unless
the `nonStrict` flag is set to true.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `publicKey` | `Uint8Array` | `undefined` |
| `nonStrict` | `boolean` | `false` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[wallet.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L328)

___

### fromV1

▸ `Static` **fromV1**(`input`, `password`): `Promise`<[`Wallet`](Wallet.md)\>

Import a wallet (Version 1 of the Ethereum wallet format).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` \| `V1Keystore` | A JSON serialized string, or an object representing V1 Keystore. |
| `password` | `string` | The keystore password. |

#### Returns

`Promise`<[`Wallet`](Wallet.md)\>

#### Defined in

[wallet.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L374)

___

### fromV3

▸ `Static` **fromV3**(`input`, `password`, `nonStrict?`): `Promise`<[`Wallet`](Wallet.md)\>

Import a wallet (Version 3 of the Ethereum wallet format). Set `nonStrict` true to accept files with mixed-caps.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | `string` \| `V3Keystore` | `undefined` | A JSON serialized string, or an object representing V3 Keystore. |
| `password` | `string` | `undefined` | The keystore password. |
| `nonStrict` | `boolean` | `false` | - |

#### Returns

`Promise`<[`Wallet`](Wallet.md)\>

#### Defined in

[wallet.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L407)

___

### generate

▸ `Static` **generate**(`icapDirect?`): [`Wallet`](Wallet.md)

Create an instance based on a new random key.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `icapDirect` | `boolean` | `false` | setting this to `true` will generate an address suitable for the `ICAP Direct mode` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[wallet.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L290)

___

### generateVanityAddress

▸ `Static` **generateVanityAddress**(`pattern`): [`Wallet`](Wallet.md)

Create an instance where the address is valid against the supplied pattern (**this will be very slow**)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` \| `RegExp` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[wallet.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L308)
