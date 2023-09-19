[@ethereumjs/wallet](../README.md) / [hdkey](../modules/hdkey.md) / EthereumHDKey

# Class: EthereumHDKey

[hdkey](../modules/hdkey.md).EthereumHDKey

## Table of contents

### Constructors

- [constructor](hdkey.EthereumHDKey.md#constructor)

### Methods

- [deriveChild](hdkey.EthereumHDKey.md#derivechild)
- [derivePath](hdkey.EthereumHDKey.md#derivepath)
- [getWallet](hdkey.EthereumHDKey.md#getwallet)
- [privateExtendedKey](hdkey.EthereumHDKey.md#privateextendedkey)
- [publicExtendedKey](hdkey.EthereumHDKey.md#publicextendedkey)
- [fromExtendedKey](hdkey.EthereumHDKey.md#fromextendedkey)
- [fromMasterSeed](hdkey.EthereumHDKey.md#frommasterseed)

## Constructors

### constructor

• **new EthereumHDKey**(`_hdkey`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hdkey` | `HDKey` |

#### Defined in

[hdkey.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L27)

## Methods

### deriveChild

▸ **deriveChild**(`index`): [`EthereumHDKey`](hdkey.EthereumHDKey.md)

Derive a node based on a child index

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`EthereumHDKey`](hdkey.EthereumHDKey.md)

#### Defined in

[hdkey.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L56)

___

### derivePath

▸ **derivePath**(`path`): [`EthereumHDKey`](hdkey.EthereumHDKey.md)

Derives a node based on a path (e.g. m/44'/0'/0/1)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

[`EthereumHDKey`](hdkey.EthereumHDKey.md)

#### Defined in

[hdkey.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L49)

___

### getWallet

▸ **getWallet**(): [`Wallet`](Wallet.md)

Return a `Wallet` instance as seen above

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[hdkey.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L63)

___

### privateExtendedKey

▸ **privateExtendedKey**(): `string`

Returns a BIP32 extended private key (xprv)

#### Returns

`string`

#### Defined in

[hdkey.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L32)

___

### publicExtendedKey

▸ **publicExtendedKey**(): `string`

Return a BIP32 extended public key (xpub)

#### Returns

`string`

#### Defined in

[hdkey.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L42)

___

### fromExtendedKey

▸ `Static` **fromExtendedKey**(`base58Key`): [`EthereumHDKey`](hdkey.EthereumHDKey.md)

Create an instance based on a BIP32 extended private or public key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `base58Key` | `string` |

#### Returns

[`EthereumHDKey`](hdkey.EthereumHDKey.md)

#### Defined in

[hdkey.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L23)

___

### fromMasterSeed

▸ `Static` **fromMasterSeed**(`seedBuffer`): [`EthereumHDKey`](hdkey.EthereumHDKey.md)

Creates an instance based on a seed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `seedBuffer` | `Uint8Array` |

#### Returns

[`EthereumHDKey`](hdkey.EthereumHDKey.md)

#### Defined in

[hdkey.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L9)

___

### fromMnemonic

▸ `Static` **fromMnemonic**(`mnemonic`, `_passphrase`): [`EthereumHDKey`](hdkey.EthereumHDKey.md)

Creates an instance based on a [BIP39 Mnemonic phrases](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string` |
| `_passphrase` | `string` |

#### Returns

[`EthereumHDKey`](hdkey.EthereumHDKey.md)

#### Defined in

[hdkey.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L16)
