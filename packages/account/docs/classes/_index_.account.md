[ethereumjs-account](../README.md) › ["index"](../modules/_index_.md) › [Account](_index_.account.md)

# Class: Account

## Hierarchy

* **Account**

## Index

### Constructors

* [constructor](_index_.account.md#constructor)

### Properties

* [balance](_index_.account.md#balance)
* [codeHash](_index_.account.md#codehash)
* [nonce](_index_.account.md#nonce)
* [stateRoot](_index_.account.md#stateroot)

### Methods

* [getCode](_index_.account.md#getcode)
* [getStorage](_index_.account.md#getstorage)
* [isContract](_index_.account.md#iscontract)
* [isEmpty](_index_.account.md#isempty)
* [serialize](_index_.account.md#serialize)
* [setCode](_index_.account.md#setcode)
* [setStorage](_index_.account.md#setstorage)

## Constructors

###  constructor

\+ **new Account**(`data?`: any): *[Account](_index_.account.md)*

*Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L41)*

Creates a new account object

~~~
var data = [
  '0x02', //nonce
  '0x0384', //balance
  '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', //stateRoot
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', //codeHash
]

var data = {
  nonce: '0x0',
  balance: '0x03e7',
  stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
}

const account = new Account(data)
~~~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data?` | any |  An account can be initialized with either a `buffer` containing the RLP serialized account. Or an `Array` of buffers relating to each of the account Properties, listed in order below.  For `Object` and `Array` each of the elements can either be a `Buffer`, hex `String`, `Number`, or an object with a `toBuffer` method such as `Bignum`.  |

**Returns:** *[Account](_index_.account.md)*

## Properties

###  balance

• **balance**: *Buffer*

*Defined in [index.ts:31](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L31)*

The account's balance in wei.

___

###  codeHash

• **codeHash**: *Buffer*

*Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L41)*

The hash of the code of the contract.

___

###  nonce

• **nonce**: *Buffer*

*Defined in [index.ts:26](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L26)*

The account's nonce.

___

###  stateRoot

• **stateRoot**: *Buffer*

*Defined in [index.ts:36](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L36)*

The stateRoot for the storage of the contract.

## Methods

###  getCode

▸ **getCode**(`trie`: Trie, `cb`: TrieGetCb): *void*

*Defined in [index.ts:116](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L116)*

Fetches the code from the trie.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`trie` | Trie | The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts |
`cb` | TrieGetCb | The callback  |

**Returns:** *void*

___

###  getStorage

▸ **getStorage**(`trie`: Trie, `key`: Buffer | string, `cb`: TrieGetCb): *void*

*Defined in [index.ts:179](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L179)*

Fetches `key` from the account's storage.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`trie` | Trie | - |
`key` | Buffer &#124; string | - |
`cb` | TrieGetCb |   |

**Returns:** *void*

___

###  isContract

▸ **isContract**(): *boolean*

*Defined in [index.ts:107](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L107)*

Returns a `Boolean` deteremining if the account is a contract.

**Returns:** *boolean*

___

###  isEmpty

▸ **isEmpty**(): *boolean*

*Defined in [index.ts:232](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L232)*

Returns a `Boolean` determining if the account is empty.

**Returns:** *boolean*

___

###  serialize

▸ **serialize**(): *Buffer*

*Defined in [index.ts:99](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L99)*

Returns the RLP serialization of the account as a `Buffer`.

**Returns:** *Buffer*

___

###  setCode

▸ **setCode**(`trie`: Trie, `code`: Buffer, `cb`: function): *void*

*Defined in [index.ts:160](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L160)*

Stores the code in the trie.

~~~
// Requires manual merkle-patricia-tree install
const SecureTrie = require('merkle-patricia-tree/secure')
const Account = require('./index.js').default

let code = Buffer.from(
'73095e7baea6a6c7c4c2dfeb977efac326af552d873173095e7baea6a6c7c4c2dfeb977efac326af552d873157',
'hex',
)

let raw = {
nonce: '0x0',
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
~~~

**Parameters:**

▪ **trie**: *Trie*

The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts.

▪ **code**: *Buffer*

▪ **cb**: *function*

The callback.

▸ (`err`: any, `codeHash`: Buffer): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | any |
`codeHash` | Buffer |

**Returns:** *void*

___

###  setStorage

▸ **setStorage**(`trie`: Trie, `key`: Buffer | string, `val`: Buffer | string, `cb`: TriePutCb): *void*

*Defined in [index.ts:218](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/account/src/index.ts#L218)*

Stores a `val` at the `key` in the contract's storage.

Example for `getStorage` and `setStorage`:

~~~
// Requires manual merkle-patricia-tree install
const SecureTrie = require('merkle-patricia-tree/secure')
const Account = require('./index.js').default

let raw = {
  nonce: '0x0',
  balance: '0x03e7',
  stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xb30fb32201fe0486606ad451e1a61e2ae1748343cd3d411ed992ffcc0774edd4',
}
let account = new Account(raw)
let trie = new SecureTrie()
let key = Buffer.from('0000000000000000000000000000000000000000', 'hex')
let value = Buffer.from('01', 'hex')

account.setStorage(trie, key, value, function(err) {
  account.getStorage(trie, key, function(err, value) {
    console.log(`Value ${value.toString('hex')} set and retrieved from trie.`)
  })
})
~~~

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`trie` | Trie | - |
`key` | Buffer &#124; string | - |
`val` | Buffer &#124; string | - |
`cb` | TriePutCb |   |

**Returns:** *void*
