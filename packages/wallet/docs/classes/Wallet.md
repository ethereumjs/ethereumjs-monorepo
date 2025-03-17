[**@ethereumjs/wallet**](../README.md)

***

[@ethereumjs/wallet](../README.md) / Wallet

# Class: Wallet

Defined in: [wallet.ts:266](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L266)

## Constructors

### new Wallet()

> **new Wallet**(`privateKey`?, `publicKey`?): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:267](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L267)

#### Parameters

##### privateKey?

`Uint8Array`

##### publicKey?

`undefined` | `Uint8Array`

#### Returns

[`Wallet`](Wallet.md)

## Methods

### getAddress()

> **getAddress**(): `Uint8Array`

Defined in: [wallet.ts:549](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L549)

Returns the wallet's address.

#### Returns

`Uint8Array`

***

### getAddressString()

> **getAddressString**(): `` `0x${string}` ``

Defined in: [wallet.ts:556](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L556)

Returns the wallet's address as a "0x" prefixed hex string

#### Returns

`` `0x${string}` ``

***

### getChecksumAddressString()

> **getChecksumAddressString**(): `` `0x${string}` ``

Defined in: [wallet.ts:564](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L564)

Returns the wallet's private key as a "0x" prefixed hex string checksummed
according to [EIP 55](https://github.com/ethereum/EIPs/issues/55).

#### Returns

`` `0x${string}` ``

***

### getPrivateKey()

> **getPrivateKey**(): `Uint8Array`

Defined in: [wallet.ts:524](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L524)

Returns the wallet's private key.

#### Returns

`Uint8Array`

***

### getPrivateKeyString()

> **getPrivateKeyString**(): `` `0x${string}` ``

Defined in: [wallet.ts:528](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L528)

#### Returns

`` `0x${string}` ``

***

### getPublicKey()

> **getPublicKey**(): `Uint8Array`

Defined in: [wallet.ts:535](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L535)

Returns the wallet's public key.

#### Returns

`Uint8Array`

***

### getPublicKeyString()

> **getPublicKeyString**(): `` `0x${string}` ``

Defined in: [wallet.ts:542](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L542)

Returns the wallet's public key as a "0x" prefixed hex string

#### Returns

`` `0x${string}` ``

***

### getV3Filename()

> **getV3Filename**(`timestamp`?): `string`

Defined in: [wallet.ts:634](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L634)

Return the suggested filename for V3 keystores.

#### Parameters

##### timestamp?

`number`

#### Returns

`string`

***

### toV3()

> **toV3**(`password`, `opts`?): `Promise`\<`V3Keystore`\>

Defined in: [wallet.ts:574](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L574)

Returns an Ethereum Version 3 Keystore Format object representing the wallet

#### Parameters

##### password

`string`

The password used to encrypt the Keystore.

##### opts?

`Partial`\<`V3Params`\>

The options for the keystore. See [its spec](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition) for more info.

#### Returns

`Promise`\<`V3Keystore`\>

***

### toV3String()

> **toV3String**(`password`, `opts`?): `Promise`\<`string`\>

Defined in: [wallet.ts:655](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L655)

#### Parameters

##### password

`string`

##### opts?

`Partial`\<`V3Params`\>

#### Returns

`Promise`\<`string`\>

***

### verifyPublicKey()

> **verifyPublicKey**(`publicKey`): `boolean`

Defined in: [wallet.ts:664](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L664)

Verify the publicKey, privateKey pair

#### Parameters

##### publicKey

`Uint8Array`

the public key to verify against the private key of the wallet

#### Returns

`boolean`

***

### fromEthSale()

> `static` **fromEthSale**(`input`, `password`): `Promise`\<[`Wallet`](Wallet.md)\>

Defined in: [wallet.ts:466](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L466)

#### Parameters

##### input

`string` | `EthSaleKeystore`

##### password

`string`

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\>

***

### fromExtendedPrivateKey()

> `static` **fromExtendedPrivateKey**(`extendedPrivateKey`): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:358](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L358)

Create an instance based on a BIP32 extended private key (xprv)

#### Parameters

##### extendedPrivateKey

`string`

#### Returns

[`Wallet`](Wallet.md)

***

### fromExtendedPublicKey()

> `static` **fromExtendedPublicKey**(`extendedPublicKey`): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:339](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L339)

Create an instance based on a BIP32 extended public key (xpub)

#### Parameters

##### extendedPublicKey

`string`

#### Returns

[`Wallet`](Wallet.md)

***

### fromPrivateKey()

> `static` **fromPrivateKey**(`privateKey`): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:351](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L351)

Create an instance based on a raw private key

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

[`Wallet`](Wallet.md)

***

### fromPublicKey()

> `static` **fromPublicKey**(`publicKey`, `nonStrict`): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:329](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L329)

Create an instance based on a public key (certain methods will not be available)

This method only accepts uncompressed Ethereum-style public keys, unless
the `nonStrict` flag is set to true.

#### Parameters

##### publicKey

`Uint8Array`

##### nonStrict

`boolean` = `false`

#### Returns

[`Wallet`](Wallet.md)

***

### fromV1()

> `static` **fromV1**(`input`, `password`): `Promise`\<[`Wallet`](Wallet.md)\>

Defined in: [wallet.ts:375](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L375)

Import a wallet (Version 1 of the Ethereum wallet format).

#### Parameters

##### input

A JSON serialized string, or an object representing V1 Keystore.

`string` | `V1Keystore`

##### password

`string`

The keystore password.

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\>

***

### fromV3()

> `static` **fromV3**(`input`, `password`, `nonStrict`): `Promise`\<[`Wallet`](Wallet.md)\>

Defined in: [wallet.ts:408](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L408)

Import a wallet (Version 3 of the Ethereum wallet format). Set `nonStrict` true to accept files with mixed-caps.

#### Parameters

##### input

A JSON serialized string, or an object representing V3 Keystore.

`string` | `V3Keystore`

##### password

`string`

The keystore password.

##### nonStrict

`boolean` = `false`

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\>

***

### generate()

> `static` **generate**(`icapDirect`): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:291](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L291)

Create an instance based on a new random key.

#### Parameters

##### icapDirect

`boolean` = `false`

setting this to `true` will generate an address suitable for the `ICAP Direct mode`

#### Returns

[`Wallet`](Wallet.md)

***

### generateVanityAddress()

> `static` **generateVanityAddress**(`pattern`): [`Wallet`](Wallet.md)

Defined in: [wallet.ts:309](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L309)

Create an instance where the address is valid against the supplied pattern (**this will be very slow**)

#### Parameters

##### pattern

`string` | `RegExp`

#### Returns

[`Wallet`](Wallet.md)
