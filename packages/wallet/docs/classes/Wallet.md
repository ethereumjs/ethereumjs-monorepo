[**@ethereumjs/wallet**](../README.md)

***

[@ethereumjs/wallet](../README.md) / Wallet

# Class: Wallet

Defined in: [wallet.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L273)

## Constructors

### Constructor

> **new Wallet**(`privateKey?`, `publicKey?`): `Wallet`

Defined in: [wallet.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L277)

#### Parameters

##### privateKey?

`Uint8Array`\<`ArrayBufferLike`\>

##### publicKey?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Wallet`

## Methods

### getAddress()

> **getAddress**(): `Uint8Array`

Defined in: [wallet.ts:562](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L562)

Returns the wallet's address.

#### Returns

`Uint8Array`

***

### getAddressString()

> **getAddressString**(): `` `0x${string}` ``

Defined in: [wallet.ts:569](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L569)

Returns the wallet's address as a "0x" prefixed hex string

#### Returns

`` `0x${string}` ``

***

### getChecksumAddressString()

> **getChecksumAddressString**(): `` `0x${string}` ``

Defined in: [wallet.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L577)

Returns the wallet's private key as a "0x" prefixed hex string checksummed
according to [EIP 55](https://github.com/ethereum/EIPs/issues/55).

#### Returns

`` `0x${string}` ``

***

### getPrivateKey()

> **getPrivateKey**(): `Uint8Array`

Defined in: [wallet.ts:537](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L537)

Returns the wallet's private key.

#### Returns

`Uint8Array`

***

### getPrivateKeyString()

> **getPrivateKeyString**(): `` `0x${string}` ``

Defined in: [wallet.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L541)

#### Returns

`` `0x${string}` ``

***

### getPublicKey()

> **getPublicKey**(): `Uint8Array`

Defined in: [wallet.ts:548](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L548)

Returns the wallet's public key.

#### Returns

`Uint8Array`

***

### getPublicKeyString()

> **getPublicKeyString**(): `` `0x${string}` ``

Defined in: [wallet.ts:555](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L555)

Returns the wallet's public key as a "0x" prefixed hex string

#### Returns

`` `0x${string}` ``

***

### getV3Filename()

> **getV3Filename**(`timestamp?`): `string`

Defined in: [wallet.ts:647](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L647)

Return the suggested filename for V3 keystores.

#### Parameters

##### timestamp?

`number`

#### Returns

`string`

***

### toV3()

> **toV3**(`password`, `opts?`): `Promise`\<`V3Keystore`\>

Defined in: [wallet.ts:587](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L587)

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

> **toV3String**(`password`, `opts?`): `Promise`\<`string`\>

Defined in: [wallet.ts:668](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L668)

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

Defined in: [wallet.ts:677](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L677)

Verify the publicKey, privateKey pair

#### Parameters

##### publicKey

`Uint8Array`

the public key to verify against the private key of the wallet

#### Returns

`boolean`

***

### fromEthSale()

> `static` **fromEthSale**(`input`, `password`): `Promise`\<`Wallet`\>

Defined in: [wallet.ts:479](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L479)

#### Parameters

##### input

`string` | `EthSaleKeystore`

##### password

`string`

#### Returns

`Promise`\<`Wallet`\>

***

### fromExtendedPrivateKey()

> `static` **fromExtendedPrivateKey**(`extendedPrivateKey`): `Wallet`

Defined in: [wallet.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L371)

Create an instance based on a BIP32 extended private key (xprv)

#### Parameters

##### extendedPrivateKey

`string`

#### Returns

`Wallet`

***

### fromExtendedPublicKey()

> `static` **fromExtendedPublicKey**(`extendedPublicKey`): `Wallet`

Defined in: [wallet.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L352)

Create an instance based on a BIP32 extended public key (xpub)

#### Parameters

##### extendedPublicKey

`string`

#### Returns

`Wallet`

***

### fromPrivateKey()

> `static` **fromPrivateKey**(`privateKey`): `Wallet`

Defined in: [wallet.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L364)

Create an instance based on a raw private key

#### Parameters

##### privateKey

`Uint8Array`

#### Returns

`Wallet`

***

### fromPublicKey()

> `static` **fromPublicKey**(`publicKey`, `nonStrict`): `Wallet`

Defined in: [wallet.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L342)

Create an instance based on a public key (certain methods will not be available)

This method only accepts uncompressed Ethereum-style public keys, unless
the `nonStrict` flag is set to true.

#### Parameters

##### publicKey

`Uint8Array`

##### nonStrict

`boolean` = `false`

#### Returns

`Wallet`

***

### fromV1()

> `static` **fromV1**(`input`, `password`): `Promise`\<`Wallet`\>

Defined in: [wallet.ts:388](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L388)

Import a wallet (Version 1 of the Ethereum wallet format).

#### Parameters

##### input

A JSON serialized string, or an object representing V1 Keystore.

`string` | `V1Keystore`

##### password

`string`

The keystore password.

#### Returns

`Promise`\<`Wallet`\>

***

### fromV3()

> `static` **fromV3**(`input`, `password`, `nonStrict`): `Promise`\<`Wallet`\>

Defined in: [wallet.ts:421](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L421)

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

`Promise`\<`Wallet`\>

***

### generate()

> `static` **generate**(`icapDirect`): `Wallet`

Defined in: [wallet.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L304)

Create an instance based on a new random key.

#### Parameters

##### icapDirect

`boolean` = `false`

setting this to `true` will generate an address suitable for the `ICAP Direct mode`

#### Returns

`Wallet`

***

### generateVanityAddress()

> `static` **generateVanityAddress**(`pattern`): `Wallet`

Defined in: [wallet.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/wallet/src/wallet.ts#L322)

Create an instance where the address is valid against the supplied pattern (**this will be very slow**)

#### Parameters

##### pattern

`string` | `RegExp`

#### Returns

`Wallet`
