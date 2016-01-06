# Transaction

[index.js:43-106](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L43-L106 "Source code on GitHub")

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
-   `from` **Buffer** If you are not planing on signing the tx you can set the from property. If you do sign it will be over written

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

## getBaseFee

[index.js:241-243](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L241-L243 "Source code on GitHub")

the minimum amount of gas the tx must have (DataFee + TxFee)

Returns **BN** 

## getDataFee

[index.js:223-234](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L223-L234 "Source code on GitHub")

The amount of gas paid for the data in this tx

Returns **BN** 

## getSenderAddress

[index.js:145-149](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L145-L149 "Source code on GitHub")

returns the sender`s address

Returns **Buffer** 

## getSenderPublicKey

[index.js:156-162](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L156-L162 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

## getUpfrontCost

[index.js:250-254](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L250-L254 "Source code on GitHub")

the up front amount that an account must have for this transaction to be valid

Returns **BN** 

## hash

[index.js:123-138](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L123-L138 "Source code on GitHub")

Computes a sha3-256 hash of the serialized tx

**Parameters**

-   `signature` **[Boolean]** whether or not to inculde the signature (optional, default `true`)

Returns **Buffer** 

## serialize

[index.js:113-115](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L113-L115 "Source code on GitHub")

Returns the rlp encoding of the transaction

Returns **Buffer** 

## sign

[index.js:210-217](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L210-L217 "Source code on GitHub")

sign a transaction with a given a private key

**Parameters**

-   `privateKey` **Buffer** 

## validate

[index.js:261-263](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L261-L263 "Source code on GitHub")

validates the signature and checks to see if it has enough gas

Returns **Boolean** 

## verifySignature

[index.js:169-204](https://github.com/ethereum/ethereumjs-tx/blob/d78f974d6339b5ab5985cd421c1a0dca458cc466/index.js#L169-L204 "Source code on GitHub")

Determines if the signature is valid

Returns **Boolean** 
