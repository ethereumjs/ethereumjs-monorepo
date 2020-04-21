[ethereumjs-wallet](../README.md) > [Wallet](../classes/wallet.md)

# Class: Wallet

## Hierarchy

**Wallet**

## Index

### Constructors

* [constructor](wallet.md#constructor)

### Properties

* [privateKey](wallet.md#privatekey)
* [publicKey](wallet.md#publickey)

### Accessors

* [privKey](wallet.md#privkey)
* [pubKey](wallet.md#pubkey)

### Methods

* [getAddress](wallet.md#getaddress)
* [getAddressString](wallet.md#getaddressstring)
* [getChecksumAddressString](wallet.md#getchecksumaddressstring)
* [getPrivateKey](wallet.md#getprivatekey)
* [getPrivateKeyString](wallet.md#getprivatekeystring)
* [getPublicKey](wallet.md#getpublickey)
* [getPublicKeyString](wallet.md#getpublickeystring)
* [getV3Filename](wallet.md#getv3filename)
* [toV3](wallet.md#tov3)
* [toV3String](wallet.md#tov3string)
* [fromEthSale](wallet.md#fromethsale)
* [fromExtendedPrivateKey](wallet.md#fromextendedprivatekey)
* [fromExtendedPublicKey](wallet.md#fromextendedpublickey)
* [fromPrivateKey](wallet.md#fromprivatekey)
* [fromPublicKey](wallet.md#frompublickey)
* [fromV1](wallet.md#fromv1)
* [fromV3](wallet.md#fromv3)
* [generate](wallet.md#generate)
* [generateVanityAddress](wallet.md#generatevanityaddress)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Wallet**(privateKey?: *`Buffer` \| `undefined`*, publicKey?: *`Buffer` \| `undefined`*): [Wallet](wallet.md)

*Defined in [index.ts:230](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L230)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Optional` privateKey | `Buffer` \| `undefined` | - |
| `Default value` publicKey | `Buffer` \| `undefined` |  undefined |

**Returns:** [Wallet](wallet.md)

___

## Properties

<a id="privatekey"></a>

### `<Private>``<Optional>` privateKey

**● privateKey**: *`Buffer` \| `undefined`*

*Defined in [index.ts:232](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L232)*

___
<a id="publickey"></a>

### `<Private>` publicKey

**● publicKey**: *`Buffer` \| `undefined`*

*Defined in [index.ts:233](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L233)*

___

## Accessors

<a id="privkey"></a>

### `<Private>` privKey

**get privKey**(): `Buffer`

*Defined in [index.ts:481](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L481)*

Returns the wallet's private key.

**Returns:** `Buffer`

___
<a id="pubkey"></a>

### `<Private>` pubKey

**get pubKey**(): `Buffer`

*Defined in [index.ts:471](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L471)*

Returns the wallet's public key.

**Returns:** `Buffer`

___

## Methods

<a id="getaddress"></a>

###  getAddress

▸ **getAddress**(): `Buffer`

*Defined in [index.ts:521](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L521)*

Returns the wallet's address.

**Returns:** `Buffer`

___
<a id="getaddressstring"></a>

###  getAddressString

▸ **getAddressString**(): `string`

*Defined in [index.ts:528](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L528)*

Returns the wallet's address as a "0x" prefixed hex string

**Returns:** `string`

___
<a id="getchecksumaddressstring"></a>

###  getChecksumAddressString

▸ **getChecksumAddressString**(): `string`

*Defined in [index.ts:536](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L536)*

Returns the wallet's private key as a "0x" prefixed hex string checksummed according to [EIP 55](https://github.com/ethereum/EIPs/issues/55).

**Returns:** `string`

___
<a id="getprivatekey"></a>

###  getPrivateKey

▸ **getPrivateKey**(): `Buffer`

*Defined in [index.ts:495](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L495)*

Returns the wallet's private key.

**Returns:** `Buffer`

___
<a id="getprivatekeystring"></a>

###  getPrivateKeyString

▸ **getPrivateKeyString**(): `string`

*Defined in [index.ts:499](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L499)*

**Returns:** `string`

___
<a id="getpublickey"></a>

###  getPublicKey

▸ **getPublicKey**(): `Buffer`

*Defined in [index.ts:507](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L507)*

Returns the wallet's public key.

**Returns:** `Buffer`

___
<a id="getpublickeystring"></a>

###  getPublicKeyString

▸ **getPublicKeyString**(): `string`

*Defined in [index.ts:514](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L514)*

Returns the wallet's public key as a "0x" prefixed hex string

**Returns:** `string`

___
<a id="getv3filename"></a>

###  getV3Filename

▸ **getV3Filename**(timestamp?: *`undefined` \| `number`*): `string`

*Defined in [index.ts:618](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L618)*

Return the suggested filename for V3 keystores.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` timestamp | `undefined` \| `number` |

**Returns:** `string`

___
<a id="tov3"></a>

###  toV3

▸ **toV3**(password: *`string`*, opts?: *`Partial`<`V3Params`>*): `V3Keystore`

*Defined in [index.ts:546](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L546)*

Returns an Etherem Version 3 Keystore Format object representing the wallet

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| password | `string` |  The password used to encrypt the Keystore. |
| `Optional` opts | `Partial`<`V3Params`> |  The options for the keystore. See [its spec](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition) for more info. |

**Returns:** `V3Keystore`

___
<a id="tov3string"></a>

###  toV3String

▸ **toV3String**(password: *`string`*, opts?: *`Partial`<`V3Params`>*): `string`

*Defined in [index.ts:636](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L636)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| password | `string` |
| `Optional` opts | `Partial`<`V3Params`> |

**Returns:** `string`

___
<a id="fromethsale"></a>

### `<Static>` fromEthSale

▸ **fromEthSale**(input: *`string` \| `EthSaleKeystore`*, password: *`string`*): [Wallet](wallet.md)

*Defined in [index.ts:445](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L445)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| input | `string` \| `EthSaleKeystore` |
| password | `string` |

**Returns:** [Wallet](wallet.md)

___
<a id="fromextendedprivatekey"></a>

### `<Static>` fromExtendedPrivateKey

▸ **fromExtendedPrivateKey**(extendedPrivateKey: *`string`*): [Wallet](wallet.md)

*Defined in [index.ts:322](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L322)*

Create an instance based on a BIP32 extended private key (xprv)

**Parameters:**

| Name | Type |
| ------ | ------ |
| extendedPrivateKey | `string` |

**Returns:** [Wallet](wallet.md)

___
<a id="fromextendedpublickey"></a>

### `<Static>` fromExtendedPublicKey

▸ **fromExtendedPublicKey**(extendedPublicKey: *`string`*): [Wallet](wallet.md)

*Defined in [index.ts:303](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L303)*

Create an instance based on a BIP32 extended public key (xpub)

**Parameters:**

| Name | Type |
| ------ | ------ |
| extendedPublicKey | `string` |

**Returns:** [Wallet](wallet.md)

___
<a id="fromprivatekey"></a>

### `<Static>` fromPrivateKey

▸ **fromPrivateKey**(privateKey: *`Buffer`*): [Wallet](wallet.md)

*Defined in [index.ts:315](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L315)*

Create an instance based on a raw private key

**Parameters:**

| Name | Type |
| ------ | ------ |
| privateKey | `Buffer` |

**Returns:** [Wallet](wallet.md)

___
<a id="frompublickey"></a>

### `<Static>` fromPublicKey

▸ **fromPublicKey**(publicKey: *`Buffer`*, nonStrict?: *`boolean`*): [Wallet](wallet.md)

*Defined in [index.ts:293](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L293)*

Create an instance based on a public key (certain methods will not be available)

This method only accepts uncompressed Ethereum-style public keys, unless the `nonStrict` flag is set to true.

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| publicKey | `Buffer` | - |
| `Default value` nonStrict | `boolean` | false |

**Returns:** [Wallet](wallet.md)

___
<a id="fromv1"></a>

### `<Static>` fromV1

▸ **fromV1**(input: *`string` \| `V1Keystore`*, password: *`string`*): [Wallet](wallet.md)

*Defined in [index.ts:339](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L339)*

Import a wallet (Version 1 of the Ethereum wallet format).

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input | `string` \| `V1Keystore` |  A JSON serialized string, or an object representing V1 Keystore. |
| password | `string` |  The keystore password. |

**Returns:** [Wallet](wallet.md)

___
<a id="fromv3"></a>

### `<Static>` fromV3

▸ **fromV3**(input: *`string` \| `V3Keystore`*, password: *`string`*, nonStrict?: *`boolean`*): [Wallet](wallet.md)

*Defined in [index.ts:379](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L379)*

Import a wallet (Version 3 of the Ethereum wallet format). Set `nonStrict` true to accept files with mixed-caps.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| input | `string` \| `V3Keystore` | - |  A JSON serialized string, or an object representing V3 Keystore. |
| password | `string` | - |  The keystore password. |
| `Default value` nonStrict | `boolean` | false |

**Returns:** [Wallet](wallet.md)

___
<a id="generate"></a>

### `<Static>` generate

▸ **generate**(icapDirect?: *`boolean`*): [Wallet](wallet.md)

*Defined in [index.ts:255](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L255)*

Create an instance based on a new random key.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` icapDirect | `boolean` | false |  setting this to \`true\` will generate an address suitable for the \`ICAP Direct mode\` |

**Returns:** [Wallet](wallet.md)

___
<a id="generatevanityaddress"></a>

### `<Static>` generateVanityAddress

▸ **generateVanityAddress**(pattern: *`RegExp` \| `string`*): [Wallet](wallet.md)

*Defined in [index.ts:272](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/index.ts#L272)*

Create an instance where the address is valid against the supplied pattern (**this will be very slow**)

**Parameters:**

| Name | Type |
| ------ | ------ |
| pattern | `RegExp` \| `string` |

**Returns:** [Wallet](wallet.md)

___

