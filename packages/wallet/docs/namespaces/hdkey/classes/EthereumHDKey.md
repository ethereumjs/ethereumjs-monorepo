[**@ethereumjs/wallet**](../../../README.md)

***

[@ethereumjs/wallet](../../../README.md) / [hdkey](../README.md) / EthereumHDKey

# Class: EthereumHDKey

Defined in: [hdkey.ts:7](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L7)

## Constructors

### new EthereumHDKey()

> **new EthereumHDKey**(`_hdkey`): [`EthereumHDKey`](EthereumHDKey.md)

Defined in: [hdkey.ts:29](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L29)

#### Parameters

##### \_hdkey

`HDKey`

#### Returns

[`EthereumHDKey`](EthereumHDKey.md)

## Methods

### deriveChild()

> **deriveChild**(`index`): [`EthereumHDKey`](EthereumHDKey.md)

Defined in: [hdkey.ts:58](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L58)

Derive a node based on a child index

#### Parameters

##### index

`number`

#### Returns

[`EthereumHDKey`](EthereumHDKey.md)

***

### derivePath()

> **derivePath**(`path`): [`EthereumHDKey`](EthereumHDKey.md)

Defined in: [hdkey.ts:51](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L51)

Derives a node based on a path (e.g. m/44'/0'/0/1)

#### Parameters

##### path

`string`

#### Returns

[`EthereumHDKey`](EthereumHDKey.md)

***

### getWallet()

> **getWallet**(): [`Wallet`](../../../classes/Wallet.md)

Defined in: [hdkey.ts:65](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L65)

Return a `Wallet` instance as seen above

#### Returns

[`Wallet`](../../../classes/Wallet.md)

***

### privateExtendedKey()

> **privateExtendedKey**(): `string`

Defined in: [hdkey.ts:34](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L34)

Returns a BIP32 extended private key (xprv)

#### Returns

`string`

***

### publicExtendedKey()

> **publicExtendedKey**(): `string`

Defined in: [hdkey.ts:44](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L44)

Return a BIP32 extended public key (xpub)

#### Returns

`string`

***

### fromExtendedKey()

> `static` **fromExtendedKey**(`base58Key`): [`EthereumHDKey`](EthereumHDKey.md)

Defined in: [hdkey.ts:25](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L25)

Create an instance based on a BIP32 extended private or public key.

#### Parameters

##### base58Key

`string`

#### Returns

[`EthereumHDKey`](EthereumHDKey.md)

***

### fromMasterSeed()

> `static` **fromMasterSeed**(`seedBuffer`): [`EthereumHDKey`](EthereumHDKey.md)

Defined in: [hdkey.ts:11](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L11)

Creates an instance based on a seed.

#### Parameters

##### seedBuffer

`Uint8Array`

#### Returns

[`EthereumHDKey`](EthereumHDKey.md)

***

### fromMnemonic()

> `static` **fromMnemonic**(`mnemonic`, `passphrase`?): [`EthereumHDKey`](EthereumHDKey.md)

Defined in: [hdkey.ts:18](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/hdkey.ts#L18)

Creates an instance based on BIP39 mnemonic phrases

#### Parameters

##### mnemonic

`string`

##### passphrase?

`string`

#### Returns

[`EthereumHDKey`](EthereumHDKey.md)
