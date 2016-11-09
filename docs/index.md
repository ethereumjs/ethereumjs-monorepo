# defineProperties

[index.js:92-92](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L92-L92 "Source code on GitHub")

Returns the rlp encoding of the transaction

Returns **Buffer** 

# defineProperty

[index.js:97-101](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L97-L101 "Source code on GitHub")

**Properties**

-   `from` **Buffer** (read only) sender address of this transaction, mathematically derived from other parameters.

# getBaseFee

[index.js:205-211](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L205-L211 "Source code on GitHub")

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

Returns **BN** 

# getDataFee

[index.js:192-199](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L192-L199 "Source code on GitHub")

The amount of gas paid for the data in this tx

Returns **BN** 

# getSenderAddress

[index.js:136-143](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L136-L143 "Source code on GitHub")

returns the sender's address

Returns **Buffer** 

# getSenderPublicKey

[index.js:149-154](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L149-L154 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

# getUpfrontCost

[index.js:217-221](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L217-L221 "Source code on GitHub")

the up front amount that an account must have for this transaction to be valid

Returns **BN** 

# hash

[index.js:119-130](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L119-L130 "Source code on GitHub")

Computes a sha3-256 hash of the serialized tx

**Parameters**

-   `signature` **[Boolean]** whether or not to inculde the signature (optional, default `true`)

Returns **Buffer** 

# index

[index.js:36-244](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L36-L244 "Source code on GitHub")

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

[index.js:182-186](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L182-L186 "Source code on GitHub")

sign a transaction with a given a private key

**Parameters**

-   `privateKey` **Buffer** 

# toCreationAddress

[index.js:110-112](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L110-L112 "Source code on GitHub")

If the tx's `to` is to the creation address

Returns **Boolean** 

# validate

[index.js:228-243](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L228-L243 "Source code on GitHub")

validates the signature and checks to see if it has enough gas

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean or String** 

# verifySignature

[index.js:160-176](https://github.com/wanderer/ethereumjs-tx/blob/0bc7ad7c37e2d27f585e4fff76822a7647f214ee/index.js#L160-L176 "Source code on GitHub")

Determines if the signature is valid

Returns **Boolean** 
