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
- [fromMnemonic](hdkey.EthereumHDKey.md#frommnemonic)

## Constructors

### constructor

• **new EthereumHDKey**(`_hdkey`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hdkey` | `HDKey` |

#### Defined in

[hdkey.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L28)

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

[hdkey.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L57)

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

[hdkey.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L50)

___

### getWallet

▸ **getWallet**(): [`Wallet`](Wallet.md)

Return a `Wallet` instance as seen above

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[hdkey.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L64)

___

### privateExtendedKey

▸ **privateExtendedKey**(): `string`

Returns a BIP32 extended private key (xprv)

#### Returns

`string`

#### Defined in

[hdkey.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L33)

___

### publicExtendedKey

▸ **publicExtendedKey**(): `string`

Return a BIP32 extended public key (xpub)

#### Returns

`string`

#### Defined in

[hdkey.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L43)

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

[hdkey.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L24)

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

[hdkey.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L10)

___

### fromMnemonic

▸ `Static` **fromMnemonic**(`mnemonic`, `passphrase?`): [`EthereumHDKey`](hdkey.EthereumHDKey.md)

Creates an instance based on BIP39 mnemonic phrases

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string` |
| `passphrase?` | `string` |

#### Returns

[`EthereumHDKey`](hdkey.EthereumHDKey.md)

#### Defined in

[hdkey.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L17)
