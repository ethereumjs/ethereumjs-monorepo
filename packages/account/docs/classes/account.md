[ethereumjs-account](../README.md) > [Account](../classes/account.md)

# Class: Account

## Hierarchy

**Account**

## Index

### Constructors

- [constructor](account.md#constructor)

### Properties

- [balance](account.md#balance)
- [codeHash](account.md#codehash)
- [nonce](account.md#nonce)
- [stateRoot](account.md#stateroot)

### Methods

- [getCode](account.md#getcode)
- [getStorage](account.md#getstorage)
- [isContract](account.md#iscontract)
- [isEmpty](account.md#isempty)
- [serialize](account.md#serialize)
- [setCode](account.md#setcode)
- [setStorage](account.md#setstorage)

---

## Constructors

<a id="constructor"></a>

### constructor

⊕ **new Account**(data: _`any`_): [Account](account.md)

_Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L41)_

**Parameters:**

| Name            | Type  | Description                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Optional` data | `any` | An account can be initialized with either a \`buffer\` containing the RLP serialized account. Or an \`Array\` of buffers relating to each of the account Properties, listed in order below.<br><br>For \`Object\` and \`Array\` each of the elements can either be a \`Buffer\`, hex \`String\`, \`Number\`, or an object with a \`toBuffer\` method such as \`Bignum\`. |

**Returns:** [Account](account.md)

---

## Properties

<a id="balance"></a>

### balance

**● balance**: _`Buffer`_

_Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L31)_

---

<a id="codehash"></a>

### codeHash

**● codeHash**: _`Buffer`_

_Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L41)_

---

<a id="nonce"></a>

### nonce

**● nonce**: _`Buffer`_

_Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L26)_

---

<a id="stateroot"></a>

### stateRoot

**● stateRoot**: _`Buffer`_

_Defined in [index.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L36)_

---

## Methods

<a id="getcode"></a>

### getCode

▸ **getCode**(trie: _`Trie`_, cb: _`TrieGetCb`_): `void`

_Defined in [index.ts:116](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L116)_

**Parameters:**

| Name | Type        | Description                                                                         |
| ---- | ----------- | ----------------------------------------------------------------------------------- |
| trie | `Trie`      | The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts |
| cb   | `TrieGetCb` | The callback                                                                        |

**Returns:** `void`

---

<a id="getstorage"></a>

### getStorage

▸ **getStorage**(trie: _`Trie`_, key: _`Buffer` \| `string`_, cb: _`TrieGetCb`_): `void`

_Defined in [index.ts:179](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L179)_

**Parameters:**

| Name | Type                 | Description |
| ---- | -------------------- | ----------- |
| trie | `Trie`               | \-          |
| key  | `Buffer` \| `string` | \-          |
| cb   | `TrieGetCb`          |             |

**Returns:** `void`

---

<a id="iscontract"></a>

### isContract

▸ **isContract**(): `boolean`

_Defined in [index.ts:107](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L107)_

**Returns:** `boolean`

---

<a id="isempty"></a>

### isEmpty

▸ **isEmpty**(): `boolean`

_Defined in [index.ts:232](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L232)_

**Returns:** `boolean`

---

<a id="serialize"></a>

### serialize

▸ **serialize**(): `Buffer`

_Defined in [index.ts:99](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L99)_

**Returns:** `Buffer`

---

<a id="setcode"></a>

### setCode

▸ **setCode**(trie: _`Trie`_, code: _`Buffer`_, cb: _`function`_): `void`

_Defined in [index.ts:160](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L160)_

**Parameters:**

| Name | Type       | Description                                                                          |
| ---- | ---------- | ------------------------------------------------------------------------------------ |
| trie | `Trie`     | The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts. |
| code | `Buffer`   | \-                                                                                   |
| cb   | `function` | The callback.<br><br>                                                                |

**Returns:** `void`

---

<a id="setstorage"></a>

### setStorage

▸ **setStorage**(trie: _`Trie`_, key: _`Buffer` \| `string`_, val: _`Buffer` \| `string`_, cb: _`TriePutCb`_): `void`

_Defined in [index.ts:218](https://github.com/ethereumjs/ethereumjs-vm/blob/d660c58/packages/account/src/index.ts#L218)_

**Parameters:**

| Name | Type                 | Description |
| ---- | -------------------- | ----------- |
| trie | `Trie`               | \-          |
| key  | `Buffer` \| `string` | \-          |
| val  | `Buffer` \| `string` | \-          |
| cb   | `TriePutCb`          |             |

**Returns:** `void`

---
