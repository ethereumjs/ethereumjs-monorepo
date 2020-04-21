[ethereumjs-wallet](../README.md) > [EthereumHDKey](../classes/ethereumhdkey.md)

# Class: EthereumHDKey

## Hierarchy

**EthereumHDKey**

## Index

### Constructors

* [constructor](ethereumhdkey.md#constructor)

### Properties

* [_hdkey](ethereumhdkey.md#_hdkey)

### Methods

* [deriveChild](ethereumhdkey.md#derivechild)
* [derivePath](ethereumhdkey.md#derivepath)
* [getWallet](ethereumhdkey.md#getwallet)
* [privateExtendedKey](ethereumhdkey.md#privateextendedkey)
* [publicExtendedKey](ethereumhdkey.md#publicextendedkey)
* [fromExtendedKey](ethereumhdkey.md#fromextendedkey)
* [fromMasterSeed](ethereumhdkey.md#frommasterseed)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EthereumHDKey**(_hdkey?: *`any`*): [EthereumHDKey](ethereumhdkey.md)

*Defined in [hdkey.ts:21](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L21)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` _hdkey | `any` |

**Returns:** [EthereumHDKey](ethereumhdkey.md)

___

## Properties

<a id="_hdkey"></a>

### `<Private>``<Optional>` _hdkey

**● _hdkey**: *`any`*

*Defined in [hdkey.ts:23](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L23)*

___

## Methods

<a id="derivechild"></a>

###  deriveChild

▸ **deriveChild**(index: *`number`*): [EthereumHDKey](ethereumhdkey.md)

*Defined in [hdkey.ts:52](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L52)*

Derive a node based on a child index

**Parameters:**

| Name | Type |
| ------ | ------ |
| index | `number` |

**Returns:** [EthereumHDKey](ethereumhdkey.md)

___
<a id="derivepath"></a>

###  derivePath

▸ **derivePath**(path: *`string`*): [EthereumHDKey](ethereumhdkey.md)

*Defined in [hdkey.ts:45](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L45)*

Derives a node based on a path (e.g. m/44'/0'/0/1)

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** [EthereumHDKey](ethereumhdkey.md)

___
<a id="getwallet"></a>

###  getWallet

▸ **getWallet**(): [Wallet](wallet.md)

*Defined in [hdkey.ts:59](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L59)*

Return a `Wallet` instance as seen above

**Returns:** [Wallet](wallet.md)

___
<a id="privateextendedkey"></a>

###  privateExtendedKey

▸ **privateExtendedKey**(): `Buffer`

*Defined in [hdkey.ts:28](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L28)*

Returns a BIP32 extended private key (xprv)

**Returns:** `Buffer`

___
<a id="publicextendedkey"></a>

###  publicExtendedKey

▸ **publicExtendedKey**(): `Buffer`

*Defined in [hdkey.ts:38](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L38)*

Return a BIP32 extended public key (xpub)

**Returns:** `Buffer`

___
<a id="fromextendedkey"></a>

### `<Static>` fromExtendedKey

▸ **fromExtendedKey**(base58Key: *`string`*): [EthereumHDKey](ethereumhdkey.md)

*Defined in [hdkey.ts:19](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L19)*

Create an instance based on a BIP32 extended private or public key.

**Parameters:**

| Name | Type |
| ------ | ------ |
| base58Key | `string` |

**Returns:** [EthereumHDKey](ethereumhdkey.md)

___
<a id="frommasterseed"></a>

### `<Static>` fromMasterSeed

▸ **fromMasterSeed**(seedBuffer: *`Buffer`*): [EthereumHDKey](ethereumhdkey.md)

*Defined in [hdkey.ts:12](https://github.com/ethereumjs/ethereumjs-wallet/blob/15de3c4/src/hdkey.ts#L12)*

Creates an instance based on a seed.

For the seed we suggest to use [bip39](https://npmjs.org/package/bip39) to create one from a BIP39 mnemonic.

**Parameters:**

| Name | Type |
| ------ | ------ |
| seedBuffer | `Buffer` |

**Returns:** [EthereumHDKey](ethereumhdkey.md)

___

