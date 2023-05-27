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
| `privateKey?` | `Buffer` | `undefined` |
| `publicKey` | `undefined` \| `Buffer` | `undefined` |

#### Defined in

[index.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L272)

## Methods

### getAddress

▸ **getAddress**(): `Buffer`

Returns the wallet's address.

#### Returns

`Buffer`

#### Defined in

[index.ts:556](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L556)

___

### getAddressString

▸ **getAddressString**(): `string`

Returns the wallet's address as a "0x" prefixed hex string

#### Returns

`string`

#### Defined in

[index.ts:563](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L563)

___

### getChecksumAddressString

▸ **getChecksumAddressString**(): `string`

Returns the wallet's private key as a "0x" prefixed hex string checksummed
according to [EIP 55](https://github.com/ethereum/EIPs/issues/55).

#### Returns

`string`

#### Defined in

[index.ts:571](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L571)

___

### getPrivateKey

▸ **getPrivateKey**(): `Buffer`

Returns the wallet's private key.

#### Returns

`Buffer`

#### Defined in

[index.ts:530](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L530)

___

### getPrivateKeyString

▸ **getPrivateKeyString**(): `string`

#### Returns

`string`

#### Defined in

[index.ts:534](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L534)

___

### getPublicKey

▸ **getPublicKey**(): `Buffer`

Returns the wallet's public key.

#### Returns

`Buffer`

#### Defined in

[index.ts:542](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L542)

___

### getPublicKeyString

▸ **getPublicKeyString**(): `string`

Returns the wallet's public key as a "0x" prefixed hex string

#### Returns

`string`

#### Defined in

[index.ts:549](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L549)

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

[index.ts:643](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L643)

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

[index.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L581)

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

[index.ts:661](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L661)

___

### verifyPublicKey

▸ **verifyPublicKey**(`publicKey`): `boolean`

Verify the publicKey, privateKey pair

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Buffer` | the public key to verify against the private key of the wallet |

#### Returns

`boolean`

#### Defined in

[index.ts:670](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L670)

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

[index.ts:471](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L471)

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

[index.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L363)

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

[index.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L344)

___

### fromPrivateKey

▸ `Static` **fromPrivateKey**(`privateKey`): [`Wallet`](Wallet.md)

Create an instance based on a raw private key

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[index.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L356)

___

### fromPublicKey

▸ `Static` **fromPublicKey**(`publicKey`, `nonStrict?`): [`Wallet`](Wallet.md)

Create an instance based on a public key (certain methods will not be available)

This method only accepts uncompressed Ethereum-style public keys, unless
the `nonStrict` flag is set to true.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `publicKey` | `Buffer` | `undefined` |
| `nonStrict` | `boolean` | `false` |

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[index.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L334)

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

[index.ts:380](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L380)

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

[index.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L413)

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

[index.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L296)

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

[index.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/index.ts#L314)
