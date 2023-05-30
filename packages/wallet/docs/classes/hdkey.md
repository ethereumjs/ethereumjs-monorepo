[@ethereumjs/wallet](../README.md) / hdkey

# Class: hdkey

## Table of contents

### Constructors

- [constructor](hdkey.md#constructor)

### Methods

- [deriveChild](hdkey.md#derivechild)
- [derivePath](hdkey.md#derivepath)
- [getWallet](hdkey.md#getwallet)
- [privateExtendedKey](hdkey.md#privateextendedkey)
- [publicExtendedKey](hdkey.md#publicextendedkey)
- [fromExtendedKey](hdkey.md#fromextendedkey)
- [fromMasterSeed](hdkey.md#frommasterseed)

## Constructors

### constructor

• **new hdkey**(`_hdkey`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_hdkey` | `HDKey` |

#### Defined in

[hdkey.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L24)

## Methods

### deriveChild

▸ **deriveChild**(`index`): [`hdkey`](hdkey.md)

Derive a node based on a child index

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`hdkey`](hdkey.md)

#### Defined in

[hdkey.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L53)

___

### derivePath

▸ **derivePath**(`path`): [`hdkey`](hdkey.md)

Derives a node based on a path (e.g. m/44'/0'/0/1)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

[`hdkey`](hdkey.md)

#### Defined in

[hdkey.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L46)

___

### getWallet

▸ **getWallet**(): [`Wallet`](Wallet.md)

Return a `Wallet` instance as seen above

#### Returns

[`Wallet`](Wallet.md)

#### Defined in

[hdkey.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L60)

___

### privateExtendedKey

▸ **privateExtendedKey**(): `string`

Returns a BIP32 extended private key (xprv)

#### Returns

`string`

#### Defined in

[hdkey.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L29)

___

### publicExtendedKey

▸ **publicExtendedKey**(): `string`

Return a BIP32 extended public key (xpub)

#### Returns

`string`

#### Defined in

[hdkey.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L39)

___

### fromExtendedKey

▸ `Static` **fromExtendedKey**(`base58Key`): [`hdkey`](hdkey.md)

Create an instance based on a BIP32 extended private or public key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `base58Key` | `string` |

#### Returns

[`hdkey`](hdkey.md)

#### Defined in

[hdkey.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L20)

___

### fromMasterSeed

▸ `Static` **fromMasterSeed**(`seedBuffer`): [`hdkey`](hdkey.md)

Creates an instance based on a seed.

For the seed we suggest to use [bip39](https://npmjs.org/package/bip39) to
create one from a BIP39 mnemonic.

#### Parameters

| Name | Type |
| :------ | :------ |
| `seedBuffer` | `Buffer` |

#### Returns

[`hdkey`](hdkey.md)

#### Defined in

[hdkey.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L13)
