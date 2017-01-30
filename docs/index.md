# defineProperties

[index.js:93-93](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L93-L93 "Source code on GitHub")

Returns the rlp encoding of the transaction

Returns **Buffer** 

# defineProperty

[index.js:98-102](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L98-L102 "Source code on GitHub")

**Properties**

-   `from` **Buffer** (read only) sender address of this transaction, mathematically derived from other parameters.

# getBaseFee

[index.js:241-247](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L241-L247 "Source code on GitHub")

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

Returns **BN** 

# getChainId

[index.js:159-161](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L159-L161 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

# getDataFee

[index.js:228-235](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L228-L235 "Source code on GitHub")

The amount of gas paid for the data in this tx

Returns **BN** 

# getSenderAddress

[index.js:167-174](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L167-L174 "Source code on GitHub")

returns the sender's address

Returns **Buffer** 

# getSenderPublicKey

[index.js:180-185](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L180-L185 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

# getUpfrontCost

[index.js:253-257](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L253-L257 "Source code on GitHub")

the up front amount that an account must have for this transaction to be valid

Returns **BN** 

# hash

[index.js:127-153](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L127-L153 "Source code on GitHub")

Computes a sha3-256 hash of the serialized tx

**Parameters**

-   `includeSignature` **[Boolean]** whether or not to inculde the signature (optional, default `true`)

Returns **Buffer** 

# index

[index.js:36-280](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L36-L280 "Source code on GitHub")

Creates a new transaction object

**Parameters**

-   `data`  

**Properties**

-   `raw` **Buffer** The raw rlp decoded transaction
-   `nonce` **Buffer** 
-   `to` **Buffer** the to address
-   `value` **Buffer** the amount of ether sent
-   `data` **Buffer** this will contain the data of the message or the init of a contract
-   `v` **Buffer** EC signature parameter
-   `r` **Buffer** EC signature parameter
-   `s` **Buffer** EC recovery ID

**Examples**

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

# sign

[index.js:215-222](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L215-L222 "Source code on GitHub")

sign a transaction with a given a private key

**Parameters**

-   `privateKey` **Buffer** 

# toCreationAddress

[index.js:118-120](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L118-L120 "Source code on GitHub")

If the tx's `to` is to the creation address

Returns **Boolean** 

# validate

[index.js:264-279](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L264-L279 "Source code on GitHub")

validates the signature and checks to see if it has enough gas

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean or String** 

# verifySignature

[index.js:191-209](https://github.com/ethereumjs/ethereumjs-tx/blob/7c0ef4cd0811897c6fa1685408d4ae48efbff857/index.js#L191-L209 "Source code on GitHub")

Determines if the signature is valid

Returns **Boolean** 
