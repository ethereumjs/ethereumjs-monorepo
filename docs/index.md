# Transaction

[index.js:46-293](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L46-L293 "Source code on GitHub")

Creates a new transaction object.

**Parameters**

-   `data` **Buffer or Array or Object** a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.Or lastly an Object containing the Properties of the transaction like in the Usage example.For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
    -   `data.chainId` **Number** EIP 155 chainId - mainnet: 1, ropsten: 3
    -   `data.gasLimit` **Buffer** transaction gas limit
    -   `data.gasPrice` **Buffer** transaction gas price
    -   `data.to` **Buffer** to the to address
    -   `data.nonce` **Buffer** nonce number
    -   `data.data` **Buffer** this will contain the data of the message or the init of a contract
    -   `data.v` **Buffer** EC recovery ID
    -   `data.r` **Buffer** EC signature parameter
    -   `data.s` **Buffer** EC signature parameter
    -   `data.value` **Buffer** the amount of ether sent

**Properties**

-   `raw` **Buffer** The raw rlp encoded transaction

**Examples**

```javascript
var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  v: '0x1c',
  r: '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  s: '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
};
var tx = new Transaction(rawTx);
```

## getBaseFee

[index.js:254-260](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L254-L260 "Source code on GitHub")

the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

Returns **BN** 

## getChainId

[index.js:172-174](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L172-L174 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

## getDataFee

[index.js:241-248](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L241-L248 "Source code on GitHub")

The amount of gas paid for the data in this tx

Returns **BN** 

## getSenderAddress

[index.js:180-187](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L180-L187 "Source code on GitHub")

returns the sender's address

Returns **Buffer** 

## getSenderPublicKey

[index.js:193-198](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L193-L198 "Source code on GitHub")

returns the public key of the sender

Returns **Buffer** 

## getUpfrontCost

[index.js:266-270](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L266-L270 "Source code on GitHub")

the up front amount that an account must have for this transaction to be valid

Returns **BN** 

## hash

[index.js:140-166](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L140-L166 "Source code on GitHub")

Computes a sha3-256 hash of the serialized tx

**Parameters**

-   `includeSignature` **[Boolean]** whether or not to inculde the signature (optional, default `true`)

Returns **Buffer** 

## sign

[index.js:228-235](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L228-L235 "Source code on GitHub")

sign a transaction with a given a private key

**Parameters**

-   `privateKey` **Buffer** 

## toCreationAddress

[index.js:131-133](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L131-L133 "Source code on GitHub")

If the tx's `to` is to the creation address

Returns **Boolean** 

## validate

[index.js:277-292](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L277-L292 "Source code on GitHub")

validates the signature and checks to see if it has enough gas

**Parameters**

-   `stringError` **[Boolean]** whether to return a string with a dscription of why the validation failed or return a Bloolean (optional, default `false`)

Returns **Boolean or String** 

## verifySignature

[index.js:204-222](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L204-L222 "Source code on GitHub")

Determines if the signature is valid

Returns **Boolean** 

## from

[index.js:111-115](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L111-L115 "Source code on GitHub")

**Properties**

-   `from` **Buffer** (read only) sender address of this transaction, mathematically derived from other parameters.

## serialize

[index.js:104-104](https://github.com/ethereumjs/ethereumjs-tx/blob/07b7b1a75168db1778d00fffd98324e8188036a1/index.js#L104-L104 "Source code on GitHub")

Returns the rlp encoding of the transaction

Returns **Buffer** 
