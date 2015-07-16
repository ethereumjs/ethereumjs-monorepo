# SYNOPSIS
Account helper functions and serialization module

# CONTACT
 [Scrollback](https://scrollback.io/ethereumjs/all/all-messages) or #ethereumjs on freenode

# INSTALL
`npm install ethereumjs-account`

# USAGE

# BROWSER
This module work with `browserify`

# API


- [`Account`](#account)
  - [`new Account([data])`](#new-accountdata)
  - [`Account` Properties](#account-properties)
  - [`Account` Methods](#account-methods)
    - [`account.serialize(data)`](#accountserializedata)
    - [`account.isContract()`](#accountiscontract)
    - [`account.toJSON()`](#accounttojson)
    - [`account.getCode(trie, cb)`](#accountgetcodetrie-cb)
    - [`account.storeCode(trie, code, cb)`](#accountstorecodetrie-code-cb)

## `Account`
Implements schema and functions relating to Accounts
- file - [lib/account.js](../lib/account.js)

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


#### `account.isContract()`
Returns a `Boolean`.

#### `account.getCode(trie, cb)`
Fetches the code from the trie
- `trie` - the [trie](github.com/wanderer/merkle-patricia-tree) to storing the accounts
- `cb` - the callback

#### `account.storeCode(trie, code, cb)`
Stores the code in the trie
- `trie` - the [trie](github.com/wanderer/merkle-patricia-tree)
- `code` - a `Buffer`
- `cb` - the callback

#### `account.serialize()`
Returns the RLP serialization of the account

#### `transaction.toJSON([object])`
returns transaction as JSON
- `object` - a `Boolean` that defaults to false. If `object` is true then this will return an object else it will return an `array`.
