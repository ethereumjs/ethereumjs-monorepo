# SYNOPSIS

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
    - [`account.serialize(data)`](#accountserializedata)
    - [`account.toJSON()`](#accounttojson)
    - [`account.getCode(trie, cb)`](#accountgetcodetrie-cb)
    - [`account.setCode(trie, code, cb)`](#accountsetcodetrie-code-cb)
    - [`account.getStorage(trie, key, cb)`](#accountgetstoragetrie-key-cb)
    - [`account.setStorage(trie, key, val, cb)`](#accountsetstoragetrie-key-val-cb)

### `new Account([data])`
Creates an new account object
- `data` - an account can be initiailized with either a `buffer` containing the RLP serialized account. 
 Or an `array` of buffers relating to each of the tx Properties, listed in order below.  For example.
```javascript
var raw = [ 
  '02', //nonce
  '0384', //balance
  '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', //stateRoot
  'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'  //codeHash
  ];

var tx = new Account(raw);
```

Or lastly an `Object` containing the Properties of the transaction

```javascript
var raw = {
  nonce: '',
  balance: '03e7',
  stateRoot: '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  codeHash: 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
};

var tx = new Account(raw);
```
For `Object` and `Arrays` each of the elements can either be a `Buffer`, hex `String` , `Number`, or an object with a `toBuffer` method such as `Bignum`.

### `Account` Properties
- `nonce` - The account's nonce.
- `balance`  - The account's balance in wie
- `stateRoot` - the stateRoot for the storage of the contract
- `codeHash` - the hash of the code of the contract

### `Account` Methods

#### `Account.isEmpty()`
Returns a `Boolean` determining if the account is empty

#### `account.isContract()`
Returns a `Boolean` deteremining if the account is a contract

#### `account.serialize()`
Returns the RLP serialization of the account as a `Buffer`

#### `acount.toJSON([object])`
Returns the account as JSON
- `object` - a `Boolean` that defaults to false. If `object` is true then this will return an object else it will return an `array`.

#### `account.getCode(trie, cb)`
Fetches the code from the trie
- `trie` - the [trie](github.com/wanderer/merkle-patricia-tree) to storing the accounts
- `cb` - the callback

#### `account.setCode(trie, code, cb)`
Stores the code in the trie
- `trie` - the [trie](github.com/wanderer/merkle-patricia-tree)
- `code` - a `Buffer`
- `cb` - the callback

#### `account.getStorage(trie, key, cb)`
Fetches `key` from the account's storage

#### `account.setStorage(trie, key, val, cb)`
Stores a `val` at the `key` in the contract's storage
