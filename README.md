# SYNOPSIS 
 [![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard) [![Build Status](https://travis-ci.org/ethereum/ethereumjs-tx.svg)](https://travis-ci.org/ethereum/ethereumjs-tx)   
A simple module for creating, manipulating and signing Ethereum transactions. 

# CONTACT
 [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

# INSTALL
`npm install ethereumjs-tx`

# USAGE

  - [example](https://github.com/ethereum/ethereumjs-tx/blob/master/examples/transactions.js)

```javascript
var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex');

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000', 
  value: '0x00', 
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
};

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

```

# BROWSER  
For standalone use in the browser inculde [./dist/ethereumjs-tx.js](https://github.com/ethereum/ethereumjs-tx/blob/master/dist/ethereumjs-tx.js)  
This will give you a gobal varible `EthTx` to use. It will also create the globals `Buffer` and `ethUtil`  
To build for standalone use in the browser install `browserify` and run `npm run build`.

# API
 - [`new Transaction([data])`](#new-transactiondata)
 - [`Transaction` Properties](#transaction-properties)
 - [`Transaction` Methods](#transaction-methods)
  - [`transaction.serialize()`](#transactionserialize) 
  - [`transaction.hash([signature])`](#transactionhashsignature)
  - [`transaction.sign(privateKey)`](#transactionsignprivatekey)
  - [`transaction.getSenderAddress()`](#transactiongetsenderaddress)
  - [`transaction.getSenderPublicKey()`](#transactiongetsenderpublickey)
  - [`transaction.validate()`](#transactionvalidate)
  - [`transaction.validateSignature()`](#transactionvalidatesignature)
  - [`transaction.getDataFee()`](#transactiongetdatafee)
  - [`transaction.getBaseFee()`](#transactiongetbasefee)
  - [`transaction.getUpfrontCost()`](#transactiongetupfrontcost)
  - [`transaction.toJSON([object])`](#transactiontojsonobject)

### `new Transaction([data])`
Creates a new transaction object
- `data` - a transaction can be initiailized with either a `buffer` containing the RLP serialized transaction or an `array` of buffers relating to each of the tx Properties, listed in order below.  For example.
```javascript
var rawTx = {
  nonce: '00',
  gasPrice: '09184e72a000', 
  gasLimit: '2710',
  to: '0000000000000000000000000000000000000000', 
  value: '00', 
  data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
  v: '1c', 
  r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  s '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
};

var tx = new Transaction(rawTx);
```
Or lastly an `Object` containing the Properties of the transaction like in the [Usage](#usage) example

For `Object` and `Arrays` each of the elements can either be a `Buffer`, hex `String` , `Number`, or an object with a `toBuffer` method such as `Bignum`

### `transaction` Properties
- `raw` - The raw rlp decoded transaction.
- `nonce` 
- `to` - the to address
- `value` - the amount of ether sent
- `data` - this will contain the `data` of the message or the `init` of a contract.
- `v` - EC signature parameter
- `r` - EC signature parameter
- `s` - EC recovery ID

--------------------------------------------------------

### `Transaction` Methods

#### `transaction.serialize()`
Returns the RLP serialization of the transaction  
**Return:** 32 Byte `Buffer`

--------------------------------------------------------

#### `transaction.hash([signature])`
Returns the SHA3-256 hash of the rlp transaction  
**Parameters**  
- `signature` - a `Boolean` determining if to include the signature components of the transaction. Defaults to true. 

**Return:** 32 Byte `Buffer`

--------------------------------------------------------

#### `transaction.sign(privateKey)`
Signs the transaction with the given privateKey.  
**Parameters**  
- `privateKey` - a 32 Byte `Buffer`

--------------------------------------------------------

#### `transaction.getSenderAddress()`
Returns the senders address  
**Return:** 20 Byte `Buffer`

--------------------------------------------------------

#### `transaction.getSenderPublicKey()`
returns the public key of the  sender  
**Return:** `Buffer`

--------------------------------------------------------

#### `transaction.validate()`
Determines if the transaction is schematicly valid by checking its signature and gasCost.  
**Return:** `Boolean` 

--------------------------------------------------------

#### `transaction.validateSignature()`
Determines if the signature is valid  
**Return:** `Boolean` 

--------------------------------------------------------

#### `transaction.getDataFee()`
Returns the amount of gas to be paid for the data in this transaction  
**Return:** `bn.js` 

--------------------------------------------------------

#### `transaction.getBaseFee()`
Returns the minimum amount of gas the tx must have (DataFee + TxFee)  
**Return:** `bn.js` 

--------------------------------------------------------

#### `transaction.getUpfrontCost()`
The total amount needed in the account of the sender for the transaction to be valid  
**Return:** `bn.js` 

--------------------------------------------------------

#### `transaction.toJSON([object])`
Returns transaction as JSON  
**Parameters**  
- `object` - a `Boolean` that defaults to false. If `object` is true then this will return an object else it will return an `array`  

**Return:** `Object` or `Array`

# TESTS
test uses mocha. To run  
`npm test`

# LICENSE
[MPL-2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2))
