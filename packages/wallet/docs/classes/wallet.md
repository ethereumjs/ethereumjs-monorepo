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

⊕ **new Wallet**(privateKey: _`Buffer` \| `undefined`_, publicKey?: _`Buffer` \| `undefined`_): [Wallet](wallet.md)

_Defined in [index.ts:229](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L229)_

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

_Defined in [index.ts:231](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L231)_

---

<a id="publickey"></a>

### `<Private>` publicKey

**● publicKey**: _`Buffer` \| `undefined`_

_Defined in [index.ts:232](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L232)_

---

## Accessors

<a id="privkey"></a>

### `<Private>` privKey

**privKey**:

_Defined in [index.ts:480](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L480)_

---

<a id="pubkey"></a>

### `<Private>` pubKey

**pubKey**:

_Defined in [index.ts:470](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L470)_

---

## Methods

<a id="getaddress"></a>

### getAddress

▸ **getAddress**(): `Buffer`

_Defined in [index.ts:520](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L520)_

**Returns:** `Buffer`

---

<a id="getaddressstring"></a>

### getAddressString

▸ **getAddressString**(): `string`

_Defined in [index.ts:527](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L527)_

**Returns:** `string`

---

<a id="getchecksumaddressstring"></a>

### getChecksumAddressString

▸ **getChecksumAddressString**(): `string`

_Defined in [index.ts:535](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L535)_

**Returns:** `string`

---

<a id="getprivatekey"></a>

### getPrivateKey

▸ **getPrivateKey**(): `Buffer`

_Defined in [index.ts:494](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L494)_

**Returns:** `Buffer`

---

<a id="getprivatekeystring"></a>

### getPrivateKeyString

▸ **getPrivateKeyString**(): `string`

_Defined in [index.ts:498](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L498)_

**Returns:** `string`

---

<a id="getpublickey"></a>

### getPublicKey

▸ **getPublicKey**(): `Buffer`

_Defined in [index.ts:506](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L506)_

**Returns:** `Buffer`

---

<a id="getpublickeystring"></a>

### getPublicKeyString

▸ **getPublicKeyString**(): `string`

_Defined in [index.ts:513](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L513)_

**Returns:** `string`

---

<a id="getv3filename"></a>

### getV3Filename

▸ **getV3Filename**(timestamp: _`undefined` \| `number`_): `string`

_Defined in [index.ts:617](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L617)_

**Parameters:**

| Name                 | Type                    |
| -------------------- | ----------------------- |
| `Optional` timestamp | `undefined` \| `number` |

**Returns:** `string`

---

<a id="tov3"></a>

### toV3

▸ **toV3**(password: _`string`_, opts: _`Partial`<`V3Params`>_): `V3Keystore`

_Defined in [index.ts:545](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L545)_

**Parameters:**

| Name            | Type                  | Description                                                                                                                       |
| --------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| password        | `string`              | The password used to encrypt the Keystore.                                                                                        |
| `Optional` opts | `Partial`<`V3Params`> | The options for the keystore. See [its spec](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition) for more info. |

**Returns:** `V3Keystore`

---

<a id="tov3string"></a>

### toV3String

▸ **toV3String**(password: _`string`_, opts: _`Partial`<`V3Params`>_): `string`

_Defined in [index.ts:635](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L635)_

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

_Defined in [index.ts:444](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L444)_

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

_Defined in [index.ts:321](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L321)_

**Parameters:**

| Name               | Type     |
| ------------------ | -------- |
| extendedPrivateKey | `string` |

**Returns:** [Wallet](wallet.md)

---

<a id="fromextendedpublickey"></a>

### `<Static>` fromExtendedPublicKey

▸ **fromExtendedPublicKey**(extendedPublicKey: _`string`_): [Wallet](wallet.md)

_Defined in [index.ts:302](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L302)_

**Parameters:**

| Name              | Type     |
| ----------------- | -------- |
| extendedPublicKey | `string` |

**Returns:** [Wallet](wallet.md)

---

<a id="fromprivatekey"></a>

### `<Static>` fromPrivateKey

▸ **fromPrivateKey**(privateKey: _`Buffer`_): [Wallet](wallet.md)

_Defined in [index.ts:314](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L314)_

**Parameters:**

| Name       | Type     |
| ---------- | -------- |
| privateKey | `Buffer` |

**Returns:** [Wallet](wallet.md)

---

<a id="frompublickey"></a>

### `<Static>` fromPublicKey

▸ **fromPublicKey**(publicKey: _`Buffer`_, nonStrict?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:292](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L292)_

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

_Defined in [index.ts:338](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L338)_

**Parameters:**

| Name     | Type                     | Description                                                      |
| -------- | ------------------------ | ---------------------------------------------------------------- |
| input    | `string` \| `V1Keystore` | A JSON serialized string, or an object representing V1 Keystore. |
| password | `string`                 | The keystore password.                                           |

**Returns:** [Wallet](wallet.md)

---

<a id="fromv3"></a>

### `<Static>` fromV3

▸ **fromV3**(input: _`string` \| `V3Keystore`_, password: _`string`_, nonStrict?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:378](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L378)_

**Parameters:**

| Name                      | Type                     | Default value | Description                                                      |
| ------------------------- | ------------------------ | ------------- | ---------------------------------------------------------------- |
| input                     | `string` \| `V3Keystore` | -             | A JSON serialized string, or an object representing V3 Keystore. |
| password                  | `string`                 | -             | The keystore password.                                           |
| `Default value` nonStrict | `boolean`                | false         |

**Returns:** [Wallet](wallet.md)

---

<a id="generate"></a>

### `<Static>` generate

▸ **generate**(icapDirect?: _`boolean`_): [Wallet](wallet.md)

_Defined in [index.ts:254](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L254)_

**Parameters:**

| Name                       | Type      | Default value | Description                                                                             |
| -------------------------- | --------- | ------------- | --------------------------------------------------------------------------------------- |
| `Default value` icapDirect | `boolean` | false         | setting this to \`true\` will generate an address suitable for the \`ICAP Direct mode\` |

**Returns:** [Wallet](wallet.md)

---

<a id="generatevanityaddress"></a>

### `<Static>` generateVanityAddress

▸ **generateVanityAddress**(pattern: _`RegExp` \| `string`_): [Wallet](wallet.md)

_Defined in [index.ts:271](https://github.com/ethereumjs/ethereumjs-wallet/blob/13fb20d/src/index.ts#L271)_

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| pattern | `RegExp` \| `string` |

**Returns:** [Wallet](wallet.md)

---
