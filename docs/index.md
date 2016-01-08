# Transaction

[index.js:43-106](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L43-L106 "Source code on GitHub")

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

[index.js:236-238](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L236-L238 "Source code on GitHub")

the minimum amount of gas the tx must have (DataFee + TxFee)

Returns **BN** 

## getDataFee

[index.js:222-229](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L222-L229 "Source code on GitHub")

The amount of gas paid for the data in this tx

Returns **BN** 

## getSenderAddress

[index.js:141-145](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L141-L145 "Source code on GitHub")

returns the sender`s address

Returns **Buffer** 

## getSenderPublicKey

[index.js:152-158](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L152-L158 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

## getUpfrontCost

[index.js:245-249](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L245-L249 "Source code on GitHub")

the up front amount that an account must have for this transaction to be valid

Returns **BN** 

## hash

[index.js:123-134](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L123-L134 "Source code on GitHub")

Computes a sha3-256 hash of the serialized tx

**Parameters**

-   `signature` **[Boolean]** whether or not to inculde the signature (optional, default `true`)

Returns **Buffer** 

## serialize

[index.js:113-115](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L113-L115 "Source code on GitHub")

Returns the rlp encoding of the transaction

Returns **Buffer** 

## sign

[index.js:209-216](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L209-L216 "Source code on GitHub")

sign a transaction with a given a private key

**Parameters**

-   `privateKey` **Buffer** 

## validate

[index.js:257-281](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L257-L281 "Source code on GitHub")

validates the signature and checks to see if it has enough gas

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean or String** 

## verifySignature

[index.js:165-203](https://github.com/ethereum/ethereumjs-tx/blob/f9c943f21509f03d0834ffd4204e17da9211cd80/index.js#L165-L203 "Source code on GitHub")

Determines if the signature is valid

Returns **Boolean** 
