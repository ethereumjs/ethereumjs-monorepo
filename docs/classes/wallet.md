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

_Defined in [index.ts:226](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L226)_

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

_Defined in [index.ts:228](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L228)_

---

<a id="publickey"></a>

### `<Private>` publicKey

**● publicKey**: _`Buffer` \| `undefined`_

_Defined in [index.ts:229](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L229)_

---

## Accessors

<a id="privkey"></a>

### `<Private>` privKey

**get privKey**(): `Buffer`

_Defined in [index.ts:432](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L432)_

**Returns:** `Buffer`

---

<a id="pubkey"></a>

### `<Private>` pubKey

**get pubKey**(): `Buffer`

_Defined in [index.ts:425](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L425)_

**Returns:** `Buffer`

---

## Methods

<a id="getaddress"></a>

### getAddress

▸ **getAddress**(): `Buffer`

_Defined in [index.ts:459](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L459)_

**Returns:** `Buffer`

---

<a id="getaddressstring"></a>

### getAddressString

▸ **getAddressString**(): `string`

_Defined in [index.ts:463](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L463)_

**Returns:** `string`

---

<a id="getchecksumaddressstring"></a>

### getChecksumAddressString

▸ **getChecksumAddressString**(): `string`

_Defined in [index.ts:467](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L467)_

**Returns:** `string`

---

<a id="getprivatekey"></a>

### getPrivateKey

▸ **getPrivateKey**(): `Buffer`

_Defined in [index.ts:442](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L442)_

**Returns:** `Buffer`

---

<a id="getprivatekeystring"></a>

### getPrivateKeyString

▸ **getPrivateKeyString**(): `string`

_Defined in [index.ts:446](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L446)_

**Returns:** `string`

---

<a id="getpublickey"></a>

### getPublicKey

▸ **getPublicKey**(): `Buffer`

_Defined in [index.ts:451](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L451)_

**Returns:** `Buffer`

---

<a id="getpublickeystring"></a>

### getPublicKeyString

▸ **getPublicKeyString**(): `string`

_Defined in [index.ts:455](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L455)_

**Returns:** `string`

---

<a id="getv3filename"></a>

### getV3Filename

▸ **getV3Filename**(timestamp?: _`undefined` \| `number`_): `string`

_Defined in [index.ts:540](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L540)_

**Parameters:**

| Name                 | Type                    |
| -------------------- | ----------------------- |
| `Optional` timestamp | `undefined` \| `number` |

**Returns:** `string`

---

<a id="tov3"></a>

### toV3

▸ **toV3**(password: _`string`_, opts?: _`Partial`<`V3Params`>_): `V3Keystore`

_Defined in [index.ts:471](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L471)_

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

_Defined in [index.ts:558](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L558)_

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

_Defined in [index.ts:402](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L402)_

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

_Defined in [index.ts:295](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L295)_

**Parameters:**

| Name               | Type     |
| ------------------ | -------- |
| extendedPrivateKey | `string` |

**Returns:** [Wallet](wallet.md)

---

<a id="fromextendedpublickey"></a>

### `<Static>` fromExtendedPublicKey

▸ **fromExtendedPublicKey**(extendedPublicKey: _`string`_): [Wallet](wallet.md)

_Defined in [index.ts:282](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L282)_

**Parameters:**

| Name              | Type     |
| ----------------- | -------- |
| extendedPublicKey | `string` |

**Returns:** [Wallet](wallet.md)

---

<a id="fromprivatekey"></a>

### `<Static>` fromPrivateKey

▸ **fromPrivateKey**(privateKey: _`Buffer`_): [Wallet](wallet.md)

_Defined in [index.ts:291](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L291)_

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| privateKey | `Buffer` |

**Returns:** [Wallet](wallet.md)

---

<a id="frompublickey"></a>

### `<Static>` fromPublicKey

▸ **fromPublicKey**(publicKey: _`Buffer`_, nonStrict?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:275](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L275)_

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

_Defined in [index.ts:306](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L306)_

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

_Defined in [index.ts:340](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L340)_

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

_Defined in [index.ts:246](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L246)_

**Parameters:**

| Name                       | Type      | Default value |
| -------------------------- | --------- | ------------- |
| `Default value` icapDirect | `boolean` | false         |

**Returns:** [Wallet](wallet.md)

---

<a id="generatevanityaddress"></a>

### `<Static>` generateVanityAddress

▸ **generateVanityAddress**(pattern: _`RegExp` \| `string`_): [Wallet](wallet.md)

_Defined in [index.ts:260](https://github.com/ethereumjs/ethereumjs-wallet/blob/ac90675/src/index.ts#L260)_

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| pattern | `RegExp` \| `string` |

**Returns:** [Wallet](wallet.md)

---
