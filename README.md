# ethereumjs-tx
An simple module for creating, manipulating and signing ethereum transactions

- [`Transaction`](#transaction)
    - [`new Transaction([data])`](#new-blockdata)
    - [`Transaction` Properties](#transaction-properties)
    - [`Transaction` Methods](#transaction-methods)
        - [`transaction.parse(data)`](#transactionparsedata)
        - [`transaction.serialize()`](#transactionserialize) 
        - [`transaction.hash([signature])`](#transactionhashsignature)
        - [`transaction.getSenderAddress()`](#transactiongetsenderaddress)
        - [`transaction.getSenderPublicKey()`](#transactiongetsenderpublickey)
        - [`transaction.validate()`](#transactionvalidate)
        - [`transaction.validateSignature()`](#transactionvalidatesignature)
        - [`transaction.getDataFee()`](#transactiongetdatafee)
        - [`transaction.getBaseFee()`](#transactiongetbasefee)
        - [`transaction.getUpfrontCost()`](#transactiongetupfrontcost)
        - [`transaction.toJSON()`](#transactiontojson)

## `Transaction`
Implements schema and functions relating to Ethereum transactions
- file - [lib/transaction.js](../lib/transaction.js)
- [example](https://wanderer.github.io/ethereum/2014/06/14/creating-and-verifying-transaction-with-node/)

### `new Transaction([data])`
Creates a new transaction object
- `data` - a transaction can be initiailized with either a `buffer` containing the RLP serialized transaction. 
 Or an `array` of buffers relating to each of the tx Properties, listed in order below.  For example.
```javascript
var rawTx = [
  '00', //nonce
  '09184e72a000', //gasPrice
  '2710', //gasLimit
  '0000000000000000000000000000000000000000', //to
  '00',  //value
  '7f7465737432000000000000000000000000000000000000000000000000000000600057', //data
  '1c', //v
  '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab', //r
  '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13' //s
];

var tx = new Transaction(rawTx);
```

Or lastly an `Object` containing the Properties of the transaction

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
For `Object` and `Arrays` each of the elements can either be a `Buffer`, hex `String` , `Number`, or an object with a `toBuffer` method such as `Bignum`

### `transaction` Properties
- `raw` - The raw rlp decoded transaction.
- `nonce` 
- `to` - the to address
- `value` - the amount of ether sent
- `data` - this will contain the `data` of the message or the `init` of a contract.
- `v` 
- `r`
- `s`

--------------------------------------------------------

### `Transaction` Methods

#### `transaction.serialize()`
Returns the RLP serialization of the transaction

#### `transaction.hash([signature])`
Returns the SHA3-256 hash of the rlp transaction
- `signature` - a `Boolean` determining if to include the signature components of the transaction. Defaults to true.

#### `transaction.getSenderAddress()`
returns the senders address

#### `transaction.getSenderPublicKey()`
returns the public key of the  sender

#### `transaction.validate()`
returns a `Boolean` determinging if the transaction is schematiclly valid

#### `transaction.validateSignature()`
returns a `Boolean` determining if the signature is valid

#### `transaction.getDataFee()`
returns the amount of gas to be paid for the data in this transaction

#### `transaction.getBaseFee()`
returns the upfront fee (DataFee + TxFee)

#### `transaction.getUpfrontCost()`
returns the total amount needed in the account of the sender for the transaction to be valid

#### `transaction.toJSON([object])`
returns transaction as JSON
- `object` - a `Boolean` that defaults to false. If `object` is true then this will return an object else it will return an `array`.
