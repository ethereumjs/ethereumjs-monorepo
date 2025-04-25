[**@ethereumjs/wallet**](../../../../README.md)

***

[@ethereumjs/wallet](../../../../README.md) / [hdkey](../README.md) / EthereumHDKey

# Class: EthereumHDKey

Defined in: [hdkey.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L8)

## Constructors

### Constructor

> **new EthereumHDKey**(`hdkey`): `EthereumHDKey`

Defined in: [hdkey.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L10)

#### Parameters

##### hdkey

`HDKey`

#### Returns

`EthereumHDKey`

## Methods

### deriveChild()

> **deriveChild**(`index`): `EthereumHDKey`

Defined in: [hdkey.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L61)

Derive a node based on a child index

#### Parameters

##### index

`number`

#### Returns

`EthereumHDKey`

***

### derivePath()

> **derivePath**(`path`): `EthereumHDKey`

Defined in: [hdkey.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L54)

Derives a node based on a path (e.g. m/44'/0'/0/1)

#### Parameters

##### path

`string`

#### Returns

`EthereumHDKey`

***

### getWallet()

> **getWallet**(): [`Wallet`](../../../../classes/Wallet.md)

Defined in: [hdkey.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L68)

Return a `Wallet` instance as seen above

#### Returns

[`Wallet`](../../../../classes/Wallet.md)

***

### privateExtendedKey()

> **privateExtendedKey**(): `string`

Defined in: [hdkey.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L37)

Returns a BIP32 extended private key (xprv)

#### Returns

`string`

***

### publicExtendedKey()

> **publicExtendedKey**(): `string`

Defined in: [hdkey.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L47)

Return a BIP32 extended public key (xpub)

#### Returns

`string`

***

### fromExtendedKey()

> `static` **fromExtendedKey**(`base58Key`): `EthereumHDKey`

Defined in: [hdkey.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L30)

Create an instance based on a BIP32 extended private or public key.

#### Parameters

##### base58Key

`string`

#### Returns

`EthereumHDKey`

***

### fromMasterSeed()

> `static` **fromMasterSeed**(`seedBuffer`): `EthereumHDKey`

Defined in: [hdkey.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L16)

Creates an instance based on a seed.

#### Parameters

##### seedBuffer

`Uint8Array`

#### Returns

`EthereumHDKey`

***

### fromMnemonic()

> `static` **fromMnemonic**(`mnemonic`, `passphrase?`): `EthereumHDKey`

Defined in: [hdkey.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L23)

Creates an instance based on BIP39 mnemonic phrases

#### Parameters

##### mnemonic

`string`

##### passphrase?

`string`

#### Returns

`EthereumHDKey`
