# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-account.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-account)
[![Build Status](https://img.shields.io/travis/ethereumjs/ethereumjs-account.svg?branch=master&style=flat-square)](https://travis-ci.org/ethereumjs/ethereumjs-account)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-account.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-account)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs-lib.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs-lib) or #ethereumjs on freenode

 [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

Implements schema and functions relating to accounts stored ethereum's state Trie   
NOTE: this is different from [ethereumjs-accounts](https://github.com/SilentCicero/ethereumjs-accounts) which should be used if you want to key management and web3 sugar.

# INSTALL
`npm install ethereumjs-account`

# BROWSER
This module work with `browserify`

# API
 - [`new Account([data])`](#new-accountdata)
  - [`Account` Properties](#account-properties)
  - [`Account` Methods](#account-methods)
    - [`account.isEmpty()`](#accountisempty)
    - [`account.isContract()`](#accountiscontract)
    - [`account.serialize()`](#accountserialize)
    - [`account.toJSON()`](#accounttojson)
    - [`account.getCode(trie, cb)`](#accountgetcodetrie-cb)
    - [`account.setCode(trie, code, cb)`](#accountsetcodetrie-code-cb)
    - [`account.getStorage(trie, key, cb)`](#accountgetstoragetrie-key-cb)
    - [`account.setStorage(trie, key, val, cb)`](#accountsetstoragetrie-key-val-cb)

### `new Account([data])`
Creates a new account object
- `data` - an account can be initialized with either a `buffer` containing the RLP serialized account.
 Or an `Array` of buffers relating to each of the account Properties, listed in order below.  For example:
```javascript
var raw = [ 
  '0x02', //nonce
  '0x0384', //balance
  '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', //stateRoot
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'  //codeHash
  ];

var account = new Account(raw);
```

Or lastly an `Object` containing the Properties of the account:

```javascript
var raw = {
  nonce: '',
  balance: '0x03e7',
  stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
};

var account = new Account(raw);
```
For `Object` and `Array` each of the elements can either be a `Buffer`, hex `String`, `Number`, or an object with a `toBuffer` method such as `Bignum`.

### `Account` Properties
- `nonce` - The account's nonce.
- `balance`  - The account's balance in wei.
- `stateRoot` - The stateRoot for the storage of the contract.
- `codeHash` - The hash of the code of the contract.

### `Account` Methods

#### `account.isEmpty()`
Returns a `Boolean` determining if the account is empty.

#### `account.isContract()`
Returns a `Boolean` deteremining if the account is a contract.

#### `account.serialize()`
Returns the RLP serialization of the account as a `Buffer`.

#### `account.toJSON([object])`
Returns the account as JSON.
- `object` - A `Boolean` that defaults to false. If `object` is true then this will return an `Object`, else it will return an `Array`.

#### `account.getCode(trie, cb)`
Fetches the code from the trie.
- `trie` - The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts.
- `cb` - The callback.

#### `account.setCode(trie, code, cb)`
Stores the code in the trie.
- `trie` - The [trie](https://github.com/ethereumjs/merkle-patricia-tree) storing the accounts.
- `code` - A `Buffer`.
- `cb` - The callback.

#### `account.getStorage(trie, key, cb)`
Fetches `key` from the account's storage.

#### `account.setStorage(trie, key, val, cb)`
Stores a `val` at the `key` in the contract's storage.
