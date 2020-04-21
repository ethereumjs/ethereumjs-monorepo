[ethereumjs-wallet](../README.md) > [Wallet](../classes/wallet.md)

# Class: Wallet

## Hierarchy

**Wallet**

## Index

### Constructors

- [constructor](wallet.md#constructor)

### Properties

- [privateKey](wallet.md#privatekey)
- [publicKey](wallet.md#publickey)

### Accessors

- [privKey](wallet.md#privkey)
- [pubKey](wallet.md#pubkey)

### Methods

- [getAddress](wallet.md#getaddress)
- [getAddressString](wallet.md#getaddressstring)
- [getChecksumAddressString](wallet.md#getchecksumaddressstring)
- [getPrivateKey](wallet.md#getprivatekey)
- [getPrivateKeyString](wallet.md#getprivatekeystring)
- [getPublicKey](wallet.md#getpublickey)
- [getPublicKeyString](wallet.md#getpublickeystring)
- [getV3Filename](wallet.md#getv3filename)
- [toV3](wallet.md#tov3)
- [toV3String](wallet.md#tov3string)
- [fromEthSale](wallet.md#fromethsale)
- [fromExtendedPrivateKey](wallet.md#fromextendedprivatekey)
- [fromExtendedPublicKey](wallet.md#fromextendedpublickey)
- [fromPrivateKey](wallet.md#fromprivatekey)
- [fromPublicKey](wallet.md#frompublickey)
- [fromV1](wallet.md#fromv1)
- [fromV3](wallet.md#fromv3)
- [generate](wallet.md#generate)
- [generateVanityAddress](wallet.md#generatevanityaddress)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Wallet**(privateKey?: _`Buffer` \| `undefined`_, publicKey?: _`Buffer` \| `undefined`_): [Wallet](wallet.md)

_Defined in [index.ts:226](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L226)_

**Parameters:**

| Name                      | Type                    | Default value |
| ------------------------- | ----------------------- | ------------- |
| `Optional` privateKey     | `Buffer` \| `undefined` | -             |
| `Default value` publicKey | `Buffer` \| `undefined` | undefined     |

**Returns:** [Wallet](wallet.md)

---

## Properties

<a id="privatekey"></a>

### ` <Private>``<Optional> ` privateKey

**● privateKey**: _`Buffer` \| `undefined`_

_Defined in [index.ts:228](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L228)_

---

<a id="publickey"></a>

### `<Private>` publicKey

**● publicKey**: _`Buffer` \| `undefined`_

_Defined in [index.ts:229](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L229)_

---

## Accessors

<a id="privkey"></a>

### `<Private>` privKey

**get privKey**(): `Buffer`

_Defined in [index.ts:462](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L462)_

**Returns:** `Buffer`

---

<a id="pubkey"></a>

### `<Private>` pubKey

**get pubKey**(): `Buffer`

_Defined in [index.ts:455](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L455)_

**Returns:** `Buffer`

---

## Methods

<a id="getaddress"></a>

### getAddress

▸ **getAddress**(): `Buffer`

_Defined in [index.ts:489](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L489)_

**Returns:** `Buffer`

---

<a id="getaddressstring"></a>

### getAddressString

▸ **getAddressString**(): `string`

_Defined in [index.ts:493](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L493)_

**Returns:** `string`

---

<a id="getchecksumaddressstring"></a>

### getChecksumAddressString

▸ **getChecksumAddressString**(): `string`

_Defined in [index.ts:497](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L497)_

**Returns:** `string`

---

<a id="getprivatekey"></a>

### getPrivateKey

▸ **getPrivateKey**(): `Buffer`

_Defined in [index.ts:472](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L472)_

**Returns:** `Buffer`

---

<a id="getprivatekeystring"></a>

### getPrivateKeyString

▸ **getPrivateKeyString**(): `string`

_Defined in [index.ts:476](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L476)_

**Returns:** `string`

---

<a id="getpublickey"></a>

### getPublicKey

▸ **getPublicKey**(): `Buffer`

_Defined in [index.ts:481](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L481)_

**Returns:** `Buffer`

---

<a id="getpublickeystring"></a>

### getPublicKeyString

▸ **getPublicKeyString**(): `string`

_Defined in [index.ts:485](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L485)_

**Returns:** `string`

---

<a id="getv3filename"></a>

### getV3Filename

▸ **getV3Filename**(timestamp?: _`undefined` \| `number`_): `string`

_Defined in [index.ts:570](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L570)_

**Parameters:**

| Name                 | Type                    |
| -------------------- | ----------------------- |
| `Optional` timestamp | `undefined` \| `number` |

**Returns:** `string`

---

<a id="tov3"></a>

### toV3

▸ **toV3**(password: _`string`_, opts?: _`Partial`<`V3Params`>_): `V3Keystore`

_Defined in [index.ts:501](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L501)_

**Parameters:**

| Name            | Type                  |
| --------------- | --------------------- |
| password        | `string`              |
| `Optional` opts | `Partial`<`V3Params`> |

**Returns:** `V3Keystore`

---

<a id="tov3string"></a>

### toV3String

▸ **toV3String**(password: _`string`_, opts?: _`Partial`<`V3Params`>_): `string`

_Defined in [index.ts:588](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L588)_

**Parameters:**

| Name            | Type                  |
| --------------- | --------------------- |
| password        | `string`              |
| `Optional` opts | `Partial`<`V3Params`> |

**Returns:** `string`

---

<a id="fromethsale"></a>

### `<Static>` fromEthSale

▸ **fromEthSale**(input: _`string` \| `EthSaleKeystore`_, password: _`string`_): [Wallet](wallet.md)

_Defined in [index.ts:432](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L432)_

**Parameters:**

| Name     | Type                          |
| -------- | ----------------------------- |
| input    | `string` \| `EthSaleKeystore` |
| password | `string`                      |

**Returns:** [Wallet](wallet.md)

---

<a id="fromextendedprivatekey"></a>

### `<Static>` fromExtendedPrivateKey

▸ **fromExtendedPrivateKey**(extendedPrivateKey: _`string`_): [Wallet](wallet.md)

_Defined in [index.ts:318](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L318)_

Create an instance based on a BIP32 extended private key (xprv)

**Parameters:**

| Name               | Type     |
| ------------------ | -------- |
| extendedPrivateKey | `string` |

**Returns:** [Wallet](wallet.md)

---

<a id="fromextendedpublickey"></a>

### `<Static>` fromExtendedPublicKey

▸ **fromExtendedPublicKey**(extendedPublicKey: _`string`_): [Wallet](wallet.md)

_Defined in [index.ts:299](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L299)_

Create an instance based on a BIP32 extended public key (xpub)

**Parameters:**

| Name              | Type     |
| ----------------- | -------- |
| extendedPublicKey | `string` |

**Returns:** [Wallet](wallet.md)

---

<a id="fromprivatekey"></a>

### `<Static>` fromPrivateKey

▸ **fromPrivateKey**(privateKey: _`Buffer`_): [Wallet](wallet.md)

_Defined in [index.ts:311](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L311)_

Create an instance based on a raw private key

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| privateKey | `Buffer` |

**Returns:** [Wallet](wallet.md)

---

<a id="frompublickey"></a>

### `<Static>` fromPublicKey

▸ **fromPublicKey**(publicKey: _`Buffer`_, nonStrict?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:289](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L289)_

Create an instance based on a public key (certain methods will not be available)

This method only accepts uncompressed Ethereum-style public keys, unless the `nonStrict` flag is set to true.

**Parameters:**

| Name                      | Type      | Default value |
| ------------------------- | --------- | ------------- |
| publicKey                 | `Buffer`  | -             |
| `Default value` nonStrict | `boolean` | false         |

**Returns:** [Wallet](wallet.md)

---

<a id="fromv1"></a>

### `<Static>` fromV1

▸ **fromV1**(input: _`string` \| `V1Keystore`_, password: _`string`_): [Wallet](wallet.md)

_Defined in [index.ts:332](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L332)_

Import a wallet (Version 1 of the Ethereum wallet format)

**Parameters:**

| Name     | Type                     |
| -------- | ------------------------ |
| input    | `string` \| `V1Keystore` |
| password | `string`                 |

**Returns:** [Wallet](wallet.md)

---

<a id="fromv3"></a>

### `<Static>` fromV3

▸ **fromV3**(input: _`string` \| `V3Keystore`_, password: _`string`_, nonStrict?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:369](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L369)_

Import a wallet (Version 3 of the Ethereum wallet format). Set `nonStrict` true to accept files with mixed-caps.

**Parameters:**

| Name                      | Type                     | Default value |
| ------------------------- | ------------------------ | ------------- |
| input                     | `string` \| `V3Keystore` | -             |
| password                  | `string`                 | -             |
| `Default value` nonStrict | `boolean`                | false         |

**Returns:** [Wallet](wallet.md)

---

<a id="generate"></a>

### `<Static>` generate

▸ **generate**(icapDirect?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:251](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L251)_

Create an instance based on a new random key.

**Parameters:**

| Name                       | Type      | Default value | Description                                                                             |
| -------------------------- | --------- | ------------- | --------------------------------------------------------------------------------------- |
| `Default value` icapDirect | `boolean` | false         | setting this to \`true\` will generate an address suitable for the \`ICAP Direct mode\` |

**Returns:** [Wallet](wallet.md)

---

<a id="generatevanityaddress"></a>

### `<Static>` generateVanityAddress

▸ **generateVanityAddress**(pattern: _`RegExp` \| `string`_): [Wallet](wallet.md)

_Defined in [index.ts:268](https://github.com/alcuadrado/ethereumjs-wallet/blob/8b5f5a9/src/index.ts#L268)_

Create an instance where the address is valid against the supplied pattern (**this will be very slow**)

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| pattern | `RegExp` \| `string` |

**Returns:** [Wallet](wallet.md)

---
