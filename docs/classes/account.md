[ethereumjs-account](../README.md) > [Account](../classes/account.md)

# Class: Account

## Hierarchy

**Account**

## Index

### Constructors

* [constructor](account.md#constructor)

### Properties

* [balance](account.md#balance)
* [codeHash](account.md#codehash)
* [nonce](account.md#nonce)
* [stateRoot](account.md#stateroot)

### Methods

* [getCode](account.md#getcode)
* [getStorage](account.md#getstorage)
* [isContract](account.md#iscontract)
* [isEmpty](account.md#isempty)
* [serialize](account.md#serialize)
* [setCode](account.md#setcode)
* [setStorage](account.md#setstorage)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Account**(data?: *`any`*): [Account](account.md)

*Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L41)*

Creates a new account object

```
var data = [
  '0x02', //nonce
  '0x0384', //balance
  '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', //stateRoot
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', //codeHash
]

var data = {
  nonce: '',
  balance: '0x03e7',
  stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
}

const account = new Account(data)
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| `Optional` data | `any` |  An account can be initialized with either a \`buffer\` containing the RLP serialized account. Or an \`Array\` of buffers relating to each of the account Properties, listed in order below.<br><br>For \`Object\` and \`Array\` each of the elements can either be a \`Buffer\`, hex \`String\`, \`Number\`, or an object with a \`toBuffer\` method such as \`Bignum\`. |

**Returns:** [Account](account.md)

___

## Properties

<a id="balance"></a>

###  balance

**● balance**: *`Buffer`*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L31)*

The account's balance in wei.

___
<a id="codehash"></a>

###  codeHash

**● codeHash**: *`Buffer`*

*Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L41)*

The hash of the code of the contract.

___
<a id="nonce"></a>

###  nonce

**● nonce**: *`Buffer`*

*Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L26)*

The account's nonce.

___
<a id="stateroot"></a>

###  stateRoot

**● stateRoot**: *`Buffer`*

*Defined in [index.ts:36](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L36)*

The stateRoot for the storage of the contract.

___

## Methods

<a id="getcode"></a>

###  getCode

▸ **getCode**(trie: *`Trie`*, cb: *`TrieGetCb`*): `void`

*Defined in [index.ts:118](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L118)*

Fetches the code from the trie.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| trie | `Trie` |  The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts |
| cb | `TrieGetCb` |  The callback |

**Returns:** `void`

___
<a id="getstorage"></a>

###  getStorage

▸ **getStorage**(trie: *`Trie`*, key: *`Buffer` \| `string`*, cb: *`TrieGetCb`*): `void`

*Defined in [index.ts:181](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L181)*

Fetches `key` from the account's storage.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| trie | `Trie` |  \- |
| key | `Buffer` \| `string` |  \- |
| cb | `TrieGetCb` |   |

**Returns:** `void`

___
<a id="iscontract"></a>

###  isContract

▸ **isContract**(): `boolean`

*Defined in [index.ts:109](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L109)*

Returns a `Boolean` deteremining if the account is a contract.

**Returns:** `boolean`

___
<a id="isempty"></a>

###  isEmpty

▸ **isEmpty**(): `boolean`

*Defined in [index.ts:235](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L235)*

Returns a `Boolean` determining if the account is empty.

**Returns:** `boolean`
if account is empty

___
<a id="serialize"></a>

###  serialize

▸ **serialize**(): `Buffer`

*Defined in [index.ts:100](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L100)*

Returns the RLP serialization of the account as a `Buffer`.

**Returns:** `Buffer`

___
<a id="setcode"></a>

###  setCode

▸ **setCode**(trie: *`Trie`*, code: *`Buffer`*, cb: *`function`*): `void`

*Defined in [index.ts:162](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L162)*

Stores the code in the trie.

```
// Requires manual merkle-patricia-tree install
const SecureTrie = require('merkle-patricia-tree/secure')
const Account = require('./index.js').default

let code = Buffer.from(
'73095e7baea6a6c7c4c2dfeb977efac326af552d873173095e7baea6a6c7c4c2dfeb977efac326af552d873157',
'hex',
)

let raw = {
nonce: '',
balance: '0x03e7',
stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
codeHash: '0xb30fb32201fe0486606ad451e1a61e2ae1748343cd3d411ed992ffcc0774edd4',
}
let account = new Account(raw)
let trie = new SecureTrie()

account.setCode(trie, code, function(err, codeHash) {
  console.log(`Code with hash 0x${codeHash.toString('hex')} set to trie`)
  account.getCode(trie, function(err, code) {
    console.log(`Code ${code.toString('hex')} read from trie`)
  })
})
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| trie | `Trie` |  The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts. |
| code | `Buffer` |  \- |
| cb | `function` |  The callback.<br><br> |

**Returns:** `void`

___
<a id="setstorage"></a>

###  setStorage

▸ **setStorage**(trie: *`Trie`*, key: *`Buffer` \| `string`*, val: *`Buffer` \| `string`*, cb: *`function`*): `void`

*Defined in [index.ts:220](https://github.com/ethereumjs/ethereumjs-account/blob/8bb1fe0/src/index.ts#L220)*

Stores a `val` at the `key` in the contract's storage.

Example for `getStorage` and `setStorage`:

```
// Requires manual merkle-patricia-tree install
const SecureTrie = require('merkle-patricia-tree/secure')
const Account = require('./index.js').default

let raw = {
  nonce: '',
  balance: '0x03e7',
  stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xb30fb32201fe0486606ad451e1a61e2ae1748343cd3d411ed992ffcc0774edd4',
}
let account = new Account(raw)
let trie = new SecureTrie()
let key = Buffer.from('0000000000000000000000000000000000000000', 'hex')
let value = Buffer.from('01', 'hex')

account.setStorage(trie, key, value, function(err, value) {
  account.getStorage(trie, key, function(err, value) {
    console.log(`Value ${value.toString('hex')} set and retrieved from trie.`)
  })
})
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| trie | `Trie` |  \- |
| key | `Buffer` \| `string` |  \- |
| val | `Buffer` \| `string` |  \- |
| cb | `function` |   |

**Returns:** `void`

___

